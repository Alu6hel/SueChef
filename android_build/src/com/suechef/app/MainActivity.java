package com.suechef.app;

import android.app.Activity;
import android.content.ContentValues;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.media.MediaScannerConnection;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.VibrationEffect;
import android.os.Vibrator;
import android.print.PrintAttributes;
import android.print.PrintManager;
import android.provider.MediaStore;
import android.util.Base64;
import android.util.Log;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.JavascriptInterface;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.FrameLayout;
import android.widget.Toast;

import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;

public class MainActivity extends Activity {
    private static final String TAG = "SueChef_MainActivity";
    private static final int BACKGROUND_COLOR = 0xFF0B0D13;
    private FrameLayout rootLayout;
    private Button exitButton;
    private WebView webView;
    private ValueCallback<Uri[]> filePathCallback;
    private final static int FILE_CHOOSER_RESULT_CODE = 1001;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        requestWindowFeature(Window.FEATURE_NO_TITLE);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
            WindowManager.LayoutParams lp = getWindow().getAttributes();
            lp.layoutInDisplayCutoutMode = WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES;
            getWindow().setAttributes(lp);
        }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            getWindow().setDecorFitsSystemWindows(false);
        }
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN,
                             WindowManager.LayoutParams.FLAG_FULLSCREEN);

        getWindow().setBackgroundDrawable(new ColorDrawable(BACKGROUND_COLOR));
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            getWindow().setStatusBarColor(BACKGROUND_COLOR);
            getWindow().setNavigationBarColor(BACKGROUND_COLOR);
        }

        // Enable web contents debugging for inspection
        WebView.setWebContentsDebuggingEnabled(true);

        rootLayout = new FrameLayout(this);
        rootLayout.setBackgroundColor(BACKGROUND_COLOR);

        // Floating Exit / Return button if user navigates outside local assets
        exitButton = new Button(this);
        exitButton.setText("✕ Return to SueChef");
        exitButton.setTextSize(13);
        exitButton.setTextColor(Color.WHITE);
        exitButton.setBackgroundColor(Color.parseColor("#E11D48"));
        exitButton.setPadding(32, 16, 32, 16);
        exitButton.setVisibility(android.view.View.GONE);

        FrameLayout.LayoutParams btnParams = new FrameLayout.LayoutParams(
            FrameLayout.LayoutParams.WRAP_CONTENT,
            FrameLayout.LayoutParams.WRAP_CONTENT
        );
        btnParams.gravity = android.view.Gravity.TOP | android.view.Gravity.END;
        btnParams.setMargins(0, 48, 48, 0);
        exitButton.setLayoutParams(btnParams);

        exitButton.setOnClickListener(v -> {
            if (webView != null) {
                webView.stopLoading();
                webView.loadUrl("file:///android_asset/index.html");
            }
            exitButton.setVisibility(android.view.View.GONE);
        });

        rootLayout.addView(exitButton);
        setContentView(rootLayout);

        initAndAttachWebView();
    }

    private void initAndAttachWebView() {
        if (webView != null) {
            try {
                if (rootLayout != null) {
                    rootLayout.removeView(webView);
                }
                webView.loadUrl("about:blank");
                webView.stopLoading();
                webView.clearHistory();
                webView.destroy();
            } catch (Exception ignored) {}
            webView = null;
        }

        webView = new WebView(this);
        webView.setBackgroundColor(BACKGROUND_COLOR);

        rootLayout.addView(webView, 0, new FrameLayout.LayoutParams(
            FrameLayout.LayoutParams.MATCH_PARENT,
            FrameLayout.LayoutParams.MATCH_PARENT
        ));

        if (exitButton != null) {
            exitButton.bringToFront();
        }

        configureWebView();
        webView.loadUrl("file:///android_asset/index.html");
    }

    private void configureWebView() {
        // Security Hardened WebSettings
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setAllowFileAccess(true); // Required for local assets
        settings.setAllowContentAccess(true);
        settings.setAllowFileAccessFromFileURLs(true); // Required for loading local asset scripts/css
        settings.setAllowUniversalAccessFromFileURLs(false); // Play Store security compliance
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setSupportZoom(false);
        settings.setUseWideViewPort(true);
        settings.setLoadWithOverviewMode(true);

        // Hardware acceleration
        webView.setLayerType(android.view.View.LAYER_TYPE_HARDWARE, null);

        // Register Native JavaScript Interface
        SueChefBridge bridge = new SueChefBridge();
        webView.addJavascriptInterface(bridge, "SueChefNative");
        webView.addJavascriptInterface(bridge, "AndroidBridge");

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                if (request != null && request.getUrl() != null) {
                    return handleUrl(request.getUrl().toString());
                }
                return false;
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                return handleUrl(url);
            }

            private boolean handleUrl(String url) {
                if (url == null) return false;
                if (url.startsWith("file:///android_asset/")) {
                    return false;
                }
                try {
                    Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    startActivity(intent);
                    return true;
                } catch (Exception e) {
                    Log.e(TAG, "External intent failed for: " + url, e);
                    return true;
                }
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                if (url != null && !url.startsWith("file:///android_asset/")) {
                    exitButton.setVisibility(android.view.View.VISIBLE);
                    exitButton.bringToFront();
                } else {
                    exitButton.setVisibility(android.view.View.GONE);
                }
            }

            // CRITICAL: Prevent white screen / sudden stop on renderer crash or OS trim
            @Override
            public boolean onRenderProcessGone(WebView view, android.webkit.RenderProcessGoneDetail detail) {
                Log.w(TAG, "WebView render process gone. Recreating in-place.");
                runOnUiThread(() -> {
                    initAndAttachWebView();
                });
                return true;
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                if (request != null && request.isForMainFrame()) {
                    Log.w(TAG, "WebView main frame error: " + (error != null ? error.getDescription() : "unknown"));
                    view.post(() -> view.loadUrl("file:///android_asset/index.html"));
                }
            }
        });

        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onShowFileChooser(WebView webView, ValueCallback<Uri[]> filePathCallback,
                                             FileChooserParams fileChooserParams) {
                if (MainActivity.this.filePathCallback != null) {
                    MainActivity.this.filePathCallback.onReceiveValue(null);
                }
                MainActivity.this.filePathCallback = filePathCallback;

                Intent intent = fileChooserParams.createIntent();
                try {
                    startActivityForResult(intent, FILE_CHOOSER_RESULT_CODE);
                } catch (Exception e) {
                    MainActivity.this.filePathCallback = null;
                    return false;
                }
                return true;
            }
        });
    }

    public class SueChefBridge {
        @JavascriptInterface
        public boolean isNativeApp() {
            return true;
        }

        @JavascriptInterface
        public boolean isNativeAvailable() {
            return true;
        }

        @JavascriptInterface
        public void vibrate(long milliseconds) {
            try {
                Vibrator v = (Vibrator) getSystemService(Context.VIBRATOR_SERVICE);
                if (v != null && v.hasVibrator()) {
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                        v.vibrate(VibrationEffect.createOneShot(milliseconds, VibrationEffect.DEFAULT_AMPLITUDE));
                    } else {
                        v.vibrate(milliseconds);
                    }
                }
            } catch (Exception e) {
                Log.e(TAG, "Vibration failed", e);
            }
        }

        @JavascriptInterface
        public void printDocument() {
            runOnUiThread(() -> {
                try {
                    PrintManager printManager = (PrintManager) getSystemService(Context.PRINT_SERVICE);
                    if (printManager != null && webView != null) {
                        String jobName = "SueChef_Legal_Filing_" + System.currentTimeMillis();
                        printManager.print(jobName, webView.createPrintDocumentAdapter(jobName), new PrintAttributes.Builder().build());
                    }
                } catch (Exception e) {
                    Log.e(TAG, "Print failed", e);
                }
            });
        }

        @JavascriptInterface
        public boolean saveFile(final String filename, final String base64Data, final String mimeType) {
            try {
                String cleanBase64 = base64Data.replaceFirst("^data:[^;]+;base64,", "");
                byte[] bytes = Base64.decode(cleanBase64, Base64.DEFAULT);

                // 1. Scoped Storage via MediaStore on Android 10+ (API 29+)
                boolean savedToMediaStore = false;
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                    ContentValues values = new ContentValues();
                    values.put(MediaStore.MediaColumns.DISPLAY_NAME, filename);
                    values.put(MediaStore.MediaColumns.MIME_TYPE, mimeType != null ? mimeType : "application/octet-stream");
                    values.put(MediaStore.MediaColumns.RELATIVE_PATH, "Download/SueChef");
                    values.put(MediaStore.MediaColumns.IS_PENDING, 1);

                    Uri uri = getContentResolver().insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, values);
                    if (uri != null) {
                        try (OutputStream os = getContentResolver().openOutputStream(uri)) {
                            if (os != null) {
                                os.write(bytes);
                                os.flush();
                                values.clear();
                                values.put(MediaStore.MediaColumns.IS_PENDING, 0);
                                getContentResolver().update(uri, values, null, null);
                                savedToMediaStore = true;
                            }
                        } catch (Exception e) {
                            Log.e(TAG, "MediaStore write failed", e);
                        }
                    }
                }

                // 2. Also ensure file exists in local app external files dir for immediate access
                File downloadsDir = getExternalFilesDir(android.os.Environment.DIRECTORY_DOWNLOADS);
                if (downloadsDir == null) {
                    downloadsDir = new File(getFilesDir(), "Download");
                }
                if (!downloadsDir.exists()) {
                    downloadsDir.mkdirs();
                }
                File localFile = new File(downloadsDir, filename);
                try (FileOutputStream fos = new FileOutputStream(localFile)) {
                    fos.write(bytes);
                    fos.flush();
                }

                MediaScannerConnection.scanFile(MainActivity.this, new String[]{localFile.getAbsolutePath()}, null, null);

                runOnUiThread(() -> {
                    Toast.makeText(MainActivity.this, "✓ Saved: " + filename, Toast.LENGTH_SHORT).show();
                });
                return true;
            } catch (Exception e) {
                Log.e(TAG, "saveFile error", e);
                runOnUiThread(() -> {
                    Toast.makeText(MainActivity.this, "Save failed: " + e.getMessage(), Toast.LENGTH_SHORT).show();
                });
                return false;
            }
        }

        @JavascriptInterface
        public boolean shareFile(final String filename, final String base64Data, final String mimeType) {
            try {
                String cleanBase64 = base64Data.replaceFirst("^data:[^;]+;base64,", "");
                byte[] bytes = Base64.decode(cleanBase64, Base64.DEFAULT);

                File cacheFile = new File(getCacheDir(), filename != null && !filename.isEmpty() ? filename : "SueChef_Document");
                try (FileOutputStream fos = new FileOutputStream(cacheFile)) {
                    fos.write(bytes);
                    fos.flush();
                }

                Uri contentUri = SueChefFileProvider.getUriForFile(cacheFile);
                Intent shareIntent = new Intent(Intent.ACTION_SEND);
                shareIntent.setType(mimeType != null ? mimeType : "application/octet-stream");
                shareIntent.putExtra(Intent.EXTRA_STREAM, contentUri);
                shareIntent.putExtra(Intent.EXTRA_SUBJECT, "SueChef Legal Document: " + filename);
                shareIntent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
                startActivity(Intent.createChooser(shareIntent, "Share Document"));
                return true;
            } catch (Exception e) {
                Log.e(TAG, "shareFile error", e);
                return false;
            }
        }

        @JavascriptInterface
        public void copyToClipboard(final String text) {
            runOnUiThread(() -> {
                try {
                    android.content.ClipboardManager cm = (android.content.ClipboardManager) getSystemService(Context.CLIPBOARD_SERVICE);
                    if (cm != null) {
                        android.content.ClipData clip = android.content.ClipData.newPlainText("SueChef", text);
                        cm.setPrimaryClip(clip);
                        Toast.makeText(MainActivity.this, "Copied to clipboard", Toast.LENGTH_SHORT).show();
                    }
                } catch (Exception e) {
                    Log.e(TAG, "Clipboard copy failed", e);
                }
            });
        }

        @JavascriptInterface
        public void showToast(final String msg) {
            runOnUiThread(() -> Toast.makeText(MainActivity.this, msg, Toast.LENGTH_SHORT).show());
        }

        @JavascriptInterface
        public void openUrl(final String url) {
            try {
                Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                startActivity(intent);
            } catch (Exception e) {
                Log.e(TAG, "openUrl failed", e);
            }
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode == FILE_CHOOSER_RESULT_CODE) {
            if (filePathCallback != null) {
                Uri[] results = null;
                if (resultCode == Activity.RESULT_OK && data != null) {
                    String dataString = data.getDataString();
                    if (dataString != null) {
                        results = new Uri[]{Uri.parse(dataString)};
                    }
                }
                filePathCallback.onReceiveValue(results);
                filePathCallback = null;
            }
        } else {
            super.onActivityResult(requestCode, resultCode, data);
        }
    }

    @Override
    public void onConfigurationChanged(android.content.res.Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
        if (webView != null) {
            webView.postDelayed(() -> webView.requestLayout(), 100);
        }
    }

    private long backPressedTime = 0;
    private Toast exitToast;

    @Override
    public void onBackPressed() {
        if (webView != null) {
            webView.evaluateJavascript(
                "(function() {" +
                "  if (typeof window.handleAndroidBack === 'function') { return window.handleAndroidBack(); }" +
                "  return false;" +
                "})();",
                result -> {
                    if ("true".equals(result)) {
                        return; // Handled by JavaScript modal/drawer dismiss
                    }
                    if (webView != null && webView.canGoBack()) {
                        webView.goBack();
                        return;
                    }
                    if (backPressedTime + 2000 > System.currentTimeMillis()) {
                        if (exitToast != null) exitToast.cancel();
                        finish();
                    } else {
                        exitToast = Toast.makeText(MainActivity.this, "Press back again to exit SueChef", Toast.LENGTH_SHORT);
                        exitToast.show();
                        backPressedTime = System.currentTimeMillis();
                    }
                }
            );
            return;
        }
        super.onBackPressed();
    }

    @Override
    protected void onPause() {
        super.onPause();
        if (webView != null) {
            webView.onPause();
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (webView != null) {
            webView.onResume();
        }
    }

    @Override
    protected void onDestroy() {
        if (webView != null) {
            try {
                if (rootLayout != null) {
                    rootLayout.removeView(webView);
                }
                webView.loadUrl("about:blank");
                webView.stopLoading();
                webView.clearHistory();
                webView.destroy();
            } catch (Exception ignored) {}
            webView = null;
        }
        super.onDestroy();
    }
}
