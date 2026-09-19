plugins {
    id("com.android.application")
    id("kotlin-android")
    // The Flutter Gradle Plugin must be applied after the Android and Kotlin Gradle plugins.
    id("dev.flutter.flutter-gradle-plugin")
}

android {
    namespace = "com.rupesh.insighteditor.insight_editor"
    compileSdk = 36  // freeRASP requires Android SDK 36+
    ndkVersion = "27.0.12077973"

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_11
        targetCompatibility = JavaVersion.VERSION_11
    }

    kotlinOptions {
        jvmTarget = JavaVersion.VERSION_11.toString()
    }

    defaultConfig {
        applicationId = "com.rupesh.insighteditor.insight_editor"
        minSdk = 23  // freeRASP requires minSdk 23+ (Android 6.0)
        targetSdk = flutter.targetSdkVersion
        versionCode = flutter.versionCode
        versionName = flutter.versionName
    }

    // ════════════════════════════════════════════════════════════
    // LAYER 4: R8 Full-Mode Obfuscation & Minification
    // ════════════════════════════════════════════════════════════
    buildTypes {
        release {
            // Signing with debug keys for now; replace with release keystore before Play Store
            signingConfig = signingConfigs.getByName("debug")

            // Enable R8 shrinking, obfuscation, and resource shrinking
            isMinifyEnabled = true
            isShrinkResources = true

            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
        debug {
            // Keep debug build clean and unobfuscated for development
            isMinifyEnabled = false
            isShrinkResources = false
        }
    }
}

flutter {
    source = "../.."
}
