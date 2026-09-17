import 'package:flutter_test/flutter_test.dart';
import 'package:insight_editor/main.dart';

void main() {
  testWidgets('App loads smoke test', (WidgetTester tester) async {
    // Build our app and trigger a frame.
    await tester.pumpWidget(const InsightEditorApp());
    expect(find.byType(InsightEditorApp), findsOneWidget);
  });
}
