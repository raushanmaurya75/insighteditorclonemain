# ════════════════════════════════════════════════════════════
# LAYER 4: ProGuard / R8 Obfuscation Rules
# Insight Editor Security Hardening
# ════════════════════════════════════════════════════════════

# ──── Flutter Core ────
-keep class io.flutter.** { *; }
-keep class io.flutter.embedding.** { *; }
-keep class io.flutter.plugin.** { *; }
-keep class io.flutter.util.** { *; }
-keep class io.flutter.view.** { *; }
-keep class io.flutter.app.** { *; }
-dontwarn io.flutter.**

# ──── Firebase ────
-keep class com.google.firebase.** { *; }
-keep class com.google.android.gms.** { *; }
-dontwarn com.google.firebase.**
-dontwarn com.google.android.gms.**
-keep class com.google.gson.** { *; }
-keepattributes Signature
-keepattributes *Annotation*

# ──── InAppWebView ────
-keep class com.pichillilorenzo.flutter_inappwebview.** { *; }
-dontwarn com.pichillilorenzo.**

# ──── Kotlin Reflection & Coroutines ────
-keep class kotlin.** { *; }
-keep class kotlin.Metadata { *; }
-keepclassmembers class kotlin.Metadata { *; }
-dontwarn kotlin.**
-keepclassmembers class kotlinx.coroutines.** { *; }
-dontwarn kotlinx.**

# ──── Our App: MainActivity and Security ────
-keep class com.rupesh.insighteditor.insight_editor.MainActivity { *; }
-keepclassmembers class com.rupesh.insighteditor.insight_editor.** { *; }

# ──── Platform Channel (MethodChannel) ────
-keepnames class io.flutter.plugin.common.MethodChannel { *; }
-keepnames class io.flutter.plugin.common.MethodCall { *; }
-keepnames class io.flutter.plugin.common.MethodChannel$Result { *; }

# ──── freeRASP ────
-keep class com.aheaditec.talsec_security.** { *; }
-dontwarn com.aheaditec.**

# ──── Remove Logging in Release ────
-assumenosideeffects class android.util.Log {
    public static boolean isLoggable(java.lang.String, int);
    public static int v(...);
    public static int d(...);
    public static int i(...);
}

# ──── Anti-Reflection / Optimization ────
-dontusemixedcaseclassnames
-dontskipnonpubliclibraryclasses
-verbose

# ──── Remove debugging attributes ────
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile

# ──── Prevent StackOverflow on aggressive inlining ────
-optimizations !code/simplification/arithmetic,!field/*,!class/merging/*

# ──── Android Components ────
-keep public class * extends android.app.Activity
-keep public class * extends android.app.Application
-keep public class * extends android.app.Service
-keep public class * extends android.content.BroadcastReceiver
-keep public class * extends android.content.ContentProvider

# ──── Parcelables ────
-keep class * implements android.os.Parcelable {
    public static final android.os.Parcelable$Creator *;
}

# ──── Serializable ────
-keepnames class * implements java.io.Serializable
-keepclassmembers class * implements java.io.Serializable {
    static final long serialVersionUID;
    private static final java.io.ObjectStreamField[] serialPersistentFields;
    !static !transient <fields>;
    private void writeObject(java.io.ObjectOutputStream);
    private void readObject(java.io.ObjectInputStream);
    java.lang.Object writeReplace();
    java.lang.Object readResolve();
}
