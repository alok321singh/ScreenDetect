package com.myproject;

import android.database.ContentObserver;
import android.net.Uri;
import android.os.Handler;
import android.provider.MediaStore;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.modules.core.DeviceEventManagerModule;  // Import DeviceEventManagerModule

import android.view.WindowManager;

import static com.facebook.react.bridge.UiThreadUtil.runOnUiThread;

public class PreventScreenshotModule extends ReactContextBaseJavaModule {

    private static final String PREVENT_SCREENSHOT_ERROR_CODE = "PREVENT_SCREENSHOT_ERROR_CODE";
    private final ReactApplicationContext reactContext;

    // Create ContentObserver for detecting screenshots
    private ContentObserver screenshotObserver;

    PreventScreenshotModule(ReactApplicationContext context) {
        super(context);
        reactContext = context;
    }

    @Override
    public String getName() {
        return "PreventScreenshotModule";
    }

    @ReactMethod
    public void forbid(Promise promise) {
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                try {
                    getCurrentActivity().getWindow().addFlags(WindowManager.LayoutParams.FLAG_SECURE);
                    promise.resolve("Done. Screenshot taking locked.");
                    // Start observing for screenshots
                     stopScreenshotDetection();
                } catch (Exception e) {
                    promise.reject(PREVENT_SCREENSHOT_ERROR_CODE, "Forbid screenshot taking failure.");
                }
            }
        });
    }

    @ReactMethod
    public void allow(Promise promise) {
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                try {
                    getCurrentActivity().getWindow().clearFlags(WindowManager.LayoutParams.FLAG_SECURE);
                    promise.resolve("Done. Screenshot taking unlocked.");
                    // Stop observing for screenshots
                     startScreenshotDetection();
                } catch (Exception e) {
                    promise.reject(PREVENT_SCREENSHOT_ERROR_CODE, "Allow screenshot taking failure.");
                }
            }
        });
    }

    // Start observing for screenshots
    private void startScreenshotDetection() {
        screenshotObserver = new ContentObserver(new Handler()) {
            @Override
            public void onChange(boolean selfChange, Uri uri) {
                super.onChange(selfChange, uri);
            
                // Check if the URI corresponds to a screenshot file
                String path = uri.getPath();
                if (path != null && path.contains("screenshot")) {
                    // Screenshot detected, you can notify here
                    // For example, by sending an event to React Native
                    reactContext
                        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit("ScreenshotTaken", "A screenshot was detected.");
                }
            }
        };

        // Register observer for new images in the media store
        reactContext.getContentResolver().registerContentObserver(
                MediaStore.Images.Media.EXTERNAL_CONTENT_URI,
                true,
                screenshotObserver
        );
    }

    // Stop observing for screenshots
    private void stopScreenshotDetection() {
        if (screenshotObserver != null) {
            reactContext.getContentResolver().unregisterContentObserver(screenshotObserver);
        }
    }
}
