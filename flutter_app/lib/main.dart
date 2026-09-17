import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';

// In-App Localhost Server to serve bundled React assets offline inside APK
final InAppLocalhostServer localhostServer = InAppLocalhostServer(
  documentRoot: 'assets/web',
  port: 8080,
);

/// Configuration for Insight Editor Mobile App
class AppConfig {
  /// Default: Embedded in-app localhost server (100% offline, standalone on phone)
  static const String embeddedUrl = "http://localhost:8080/";

  /// Dev server fallback (when debugging live from laptop emulator)
  static const String devServerUrl = "http://10.0.2.2:8080";

  /// Production hosted URL (if deployed on web)
  static const String productionUrl = "https://your-domain.com";

  /// Mode switcher: defaults to embedded in-app bundle
  static String get initialUrl => embeddedUrl;
}

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Start internal web server for embedded dist assets on mobile
  if (!kIsWeb &&
      (defaultTargetPlatform == TargetPlatform.android ||
          defaultTargetPlatform == TargetPlatform.iOS)) {
    try {
      await localhostServer.start();
    } catch (e) {
      debugPrint('LocalhostServer start note: $e');
    }
  }

  // Set Android system bars (status bar and navigation bar) styling
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.dark,
      systemNavigationBarColor: Colors.white,
      systemNavigationBarIconBrightness: Brightness.dark,
      systemNavigationBarDividerColor: Color(0xFFE5E5E5),
    ),
  );

  runApp(const InsightEditorApp());
}

class InsightEditorApp extends StatelessWidget {
  const InsightEditorApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Insight Editor',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFFE1306C),
          primary: const Color(0xFF000000),
          surface: Colors.white,
        ),
        useMaterial3: true,
        scaffoldBackgroundColor: Colors.white,
      ),
      home: const WebViewScreen(),
    );
  }
}

class WebViewScreen extends StatefulWidget {
  const WebViewScreen({super.key});

  @override
  State<WebViewScreen> createState() => _WebViewScreenState();
}

class _WebViewScreenState extends State<WebViewScreen> {
  InAppWebViewController? _webViewController;
  PullToRefreshController? _pullToRefreshController;
  bool _hasError = false;
  String _errorMessage = '';
  DateTime? _lastBackPressTime;

  late final InAppWebViewSettings _settings;

  @override
  void initState() {
    super.initState();

    _settings = InAppWebViewSettings(
      useShouldOverrideUrlLoading: true,
      mediaPlaybackRequiresUserGesture: false,
      allowsInlineMediaPlayback: true,
      iframeAllow: "camera; microphone; fullscreen",
      iframeAllowFullscreen: true,
      useHybridComposition: true,
      javaScriptEnabled: true,
      domStorageEnabled: true,
      databaseEnabled: true,
      cacheEnabled: true,
      supportZoom: false,
      verticalScrollBarEnabled: false,
      horizontalScrollBarEnabled: false,
      disableHorizontalScroll: true,
      overScrollMode: OverScrollMode.NEVER,
      allowFileAccess: true,
      allowContentAccess: true,
      allowFileAccessFromFileURLs: true,
      allowUniversalAccessFromFileURLs: true,
      mixedContentMode: MixedContentMode.MIXED_CONTENT_ALWAYS_ALLOW,
      transparentBackground: false,
    );

    final isMobile = !kIsWeb &&
        (defaultTargetPlatform == TargetPlatform.android ||
            defaultTargetPlatform == TargetPlatform.iOS);

    if (isMobile) {
      _pullToRefreshController = PullToRefreshController(
        settings: PullToRefreshSettings(
          color: const Color(0xFFE1306C),
          backgroundColor: Colors.white,
        ),
        onRefresh: () async {
          if (_webViewController != null) {
            _webViewController!.reload();
          }
        },
      );
    }
  }

  void _retryLoading() {
    setState(() {
      _hasError = false;
      _errorMessage = '';
    });
    _webViewController?.loadUrl(
      urlRequest: URLRequest(url: WebUri(AppConfig.initialUrl)),
    );
  }

  void _openUrlDialog() {
    final textController = TextEditingController(text: AppConfig.initialUrl);
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Change Server URL'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Switch between embedded offline mode and live URL:',
              style: TextStyle(fontSize: 13, color: Colors.black87),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: textController,
              decoration: const InputDecoration(
                border: OutlineInputBorder(),
                hintText: 'http://localhost:8080/',
                isDense: true,
              ),
            ),
            const SizedBox(height: 8),
            Wrap(
              spacing: 6,
              children: [
                ActionChip(
                  label: const Text('Embedded Offline', style: TextStyle(fontSize: 11)),
                  onPressed: () {
                    textController.text = AppConfig.embeddedUrl;
                  },
                ),
                ActionChip(
                  label: const Text('Dev Server', style: TextStyle(fontSize: 11)),
                  onPressed: () {
                    textController.text = AppConfig.devServerUrl;
                  },
                ),
              ],
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              final newUrl = textController.text.trim();
              if (newUrl.isNotEmpty) {
                Navigator.pop(ctx);
                setState(() {
                  _hasError = false;
                  _errorMessage = '';
                });
                _webViewController?.loadUrl(
                  urlRequest: URLRequest(url: WebUri(newUrl)),
                );
              }
            },
            child: const Text('Load URL'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, result) async {
        if (didPop) return;

        if (_webViewController != null && await _webViewController!.canGoBack()) {
          _webViewController!.goBack();
          return;
        }

        final now = DateTime.now();
        if (_lastBackPressTime == null ||
            now.difference(_lastBackPressTime!) > const Duration(seconds: 2)) {
          _lastBackPressTime = now;
          if (!context.mounted) return;
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Press back again to exit'),
              duration: Duration(seconds: 2),
              behavior: SnackBarBehavior.floating,
            ),
          );
          return;
        }

        // Exit the app
        SystemNavigator.pop();
      },
      child: Scaffold(
        backgroundColor: Colors.white,
        body: SafeArea(
          top: true,
          bottom: false,
          child: Stack(
            children: [
              // WebView loading from embedded in-app localhost or specified URL
              InAppWebView(
                initialUrlRequest: URLRequest(url: WebUri(AppConfig.initialUrl)),
                initialSettings: _settings,
                pullToRefreshController: _pullToRefreshController,
                onWebViewCreated: (controller) {
                  _webViewController = controller;
                },
                onLoadStart: (controller, url) {
                  setState(() {
                    _hasError = false;
                  });
                },
                onLoadStop: (controller, url) async {
                  _pullToRefreshController?.endRefreshing();
                },
                onReceivedError: (controller, request, error) {
                  _pullToRefreshController?.endRefreshing();
                  if (request.isForMainFrame ?? true) {
                    setState(() {
                      _hasError = true;
                      _errorMessage = error.description;
                    });
                  }
                },
                onProgressChanged: (controller, progress) {
                  if (progress == 100) {
                    _pullToRefreshController?.endRefreshing();
                  }
                },
              ),

              // Error / Offline State
              if (_hasError)
                Container(
                  color: Colors.white,
                  padding: const EdgeInsets.symmetric(horizontal: 24),
                  child: Center(
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Container(
                          width: 64,
                          height: 64,
                          decoration: BoxDecoration(
                            color: const Color(0xFFFDE8E8),
                            borderRadius: BorderRadius.circular(32),
                          ),
                          child: const Icon(
                            Icons.wifi_off_rounded,
                            size: 32,
                            color: Color(0xFFE02424),
                          ),
                        ),
                        const SizedBox(height: 18),
                        const Text(
                          'Unable to Load',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                            color: Color(0xFF111827),
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          _errorMessage.isNotEmpty
                              ? 'Error: $_errorMessage\n\nTarget: ${AppConfig.initialUrl}'
                              : 'Could not load the embedded or remote web content.',
                          textAlign: TextAlign.center,
                          style: const TextStyle(
                            fontSize: 13,
                            color: Color(0xFF6B7280),
                            height: 1.4,
                          ),
                        ),
                        const SizedBox(height: 24),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            OutlinedButton.icon(
                              onPressed: _openUrlDialog,
                              icon: const Icon(Icons.settings, size: 16),
                              label: const Text('Options'),
                              style: OutlinedButton.styleFrom(
                                foregroundColor: Colors.black87,
                                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                              ),
                            ),
                            const SizedBox(width: 12),
                            ElevatedButton.icon(
                              onPressed: _retryLoading,
                              icon: const Icon(Icons.refresh_rounded, size: 16),
                              label: const Text('Retry'),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: const Color(0xFF000000),
                                foregroundColor: Colors.white,
                                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }
}
