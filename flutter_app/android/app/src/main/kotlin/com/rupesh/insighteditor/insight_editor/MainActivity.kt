package com.rupesh.insighteditor.insight_editor

import android.content.pm.PackageManager
import android.content.pm.Signature
import android.os.Build
import android.os.Bundle
import android.os.Debug
import android.view.View
import android.view.WindowInsetsController
import io.flutter.embedding.android.FlutterActivity
import io.flutter.embedding.engine.FlutterEngine
import io.flutter.plugin.common.MethodChannel
import java.io.File
import java.security.MessageDigest

class MainActivity : FlutterActivity() {

    // ═══════════════════════════════════════════════════════════
    // LAYER 3: Native Security Platform Channel
    // ═══════════════════════════════════════════════════════════

    private val SECURITY_CHANNEL = "com.rupesh.insighteditor/security"

    /**
     * Expected SHA-256 fingerprint of the official signing certificate.
     * Format: lowercase colon-separated hex bytes.
     * IMPORTANT: Replace this with your real release key fingerprint before Play Store submission.
     * Get it via: keytool -list -v -keystore your-key.jks
     */
    private val EXPECTED_CERT_SHA256 = "" // Leave empty to skip cert check until release key is set

    override fun configureFlutterEngine(flutterEngine: FlutterEngine) {
        super.configureFlutterEngine(flutterEngine)

        MethodChannel(flutterEngine.dartExecutor.binaryMessenger, SECURITY_CHANNEL)
            .setMethodCallHandler { call, result ->
                when (call.method) {
                    "checkIntegrity" -> {
                        val passed = runAllNativeChecks()
                        result.success(passed)
                    }
                    else -> result.notImplemented()
                }
            }
    }

    /**
     * Runs all native Kotlin security checks.
     * Returns true if device is clean, false if any check fails.
     */
    private fun runAllNativeChecks(): Boolean {
        // 1. Anti-Debugger check (native layer)
        if (isDebuggerAttached()) {
            android.util.Log.e("SECURITY", "[FAIL] Debugger attached")
            return false
        }

        // 2. Emulator detection
        if (isRunningOnEmulator()) {
            android.util.Log.e("SECURITY", "[FAIL] Emulator detected")
            return false
        }

        // 3. APK Signature validation (skip if no expected cert configured)
        if (EXPECTED_CERT_SHA256.isNotEmpty() && !isSignatureValid()) {
            android.util.Log.e("SECURITY", "[FAIL] Signature mismatch — APK re-signed or tampered")
            return false
        }

        // 4. Root detection
        if (isDeviceRooted()) {
            android.util.Log.e("SECURITY", "[FAIL] Root detected")
            return false
        }

        android.util.Log.d("SECURITY", "[PASS] All native integrity checks passed")
        return true
    }

    /**
     * Detects if a debugger is attached to the process.
     */
    private fun isDebuggerAttached(): Boolean {
        return Debug.isDebuggerConnected() || Debug.waitingForDebugger()
    }

    /**
     * Detects emulator via Build properties.
     */
    private fun isRunningOnEmulator(): Boolean {
        val fingerprint = Build.FINGERPRINT.lowercase()
        val model = Build.MODEL.lowercase()
        val manufacturer = Build.MANUFACTURER.lowercase()
        val brand = Build.BRAND.lowercase()
        val device = Build.DEVICE.lowercase()
        val product = Build.PRODUCT.lowercase()

        val knownEmulatorFingerprints = listOf("generic", "unknown", "google_sdk", "emulator", "android_x86")
        val knownEmulatorModels = listOf("sdk", "emulator", "android sdk built for x86", "google sdk")

        return knownEmulatorFingerprints.any { fingerprint.contains(it) } ||
                knownEmulatorModels.any { model.contains(it) } ||
                manufacturer.contains("genymotion") ||
                brand.startsWith("generic") ||
                device.startsWith("generic") ||
                product.contains("sdk_gphone") ||
                product.contains("google_sdk") ||
                Build.HARDWARE.lowercase().contains("goldfish") ||
                Build.HARDWARE.lowercase().contains("ranchu")
    }

    /**
     * Validates APK signing certificate SHA-256 against expected value.
     */
    private fun isSignatureValid(): Boolean {
        return try {
            val packageName = applicationContext.packageName
            val signatures: Array<Signature> = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
                val packageInfo = packageManager.getPackageInfo(
                    packageName,
                    PackageManager.GET_SIGNING_CERTIFICATES
                )
                packageInfo.signingInfo?.apkContentsSigners ?: return false
            } else {
                @Suppress("DEPRECATION")
                val packageInfo = packageManager.getPackageInfo(
                    packageName,
                    PackageManager.GET_SIGNATURES
                )
                @Suppress("DEPRECATION")
                packageInfo.signatures ?: return false
            }

            val md = MessageDigest.getInstance("SHA-256")
            for (sig in signatures) {
                val digest = md.digest(sig.toByteArray())
                val hex = digest.joinToString(":") { "%02x".format(it) }
                if (hex == EXPECTED_CERT_SHA256) return true
            }
            false
        } catch (e: Exception) {
            android.util.Log.w("SECURITY", "Signature check exception: ${e.message}")
            true // Fail-open on exception (avoid locking out legitimate users during transition)
        }
    }

    /**
     * Basic root detection via known root binary paths.
     */
    private fun isDeviceRooted(): Boolean {
        val rootPaths = listOf(
            "/system/app/Superuser.apk",
            "/sbin/su",
            "/system/bin/su",
            "/system/xbin/su",
            "/data/local/xbin/su",
            "/data/local/bin/su",
            "/system/sd/xbin/su",
            "/system/bin/failsafe/su",
            "/data/local/su",
            "/su/bin/su"
        )
        return rootPaths.any { File(it).exists() }
    }

    // ═══════════════════════════════════════════════════════════
    // Light Mode System Bar Styling
    // ═══════════════════════════════════════════════════════════

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        applyLightSystemBars()
    }

    override fun onResume() {
        super.onResume()
        applyLightSystemBars()
    }

    private fun applyLightSystemBars() {
        window.statusBarColor = android.graphics.Color.WHITE
        window.navigationBarColor = android.graphics.Color.WHITE

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            window.insetsController?.setSystemBarsAppearance(
                WindowInsetsController.APPEARANCE_LIGHT_STATUS_BARS or WindowInsetsController.APPEARANCE_LIGHT_NAVIGATION_BARS,
                WindowInsetsController.APPEARANCE_LIGHT_STATUS_BARS or WindowInsetsController.APPEARANCE_LIGHT_NAVIGATION_BARS
            )
        } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            @Suppress("DEPRECATION")
            var flags = window.decorView.systemUiVisibility
            flags = flags or View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                flags = flags or View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR
            }
            @Suppress("DEPRECATION")
            window.decorView.systemUiVisibility = flags
        }
    }
}
