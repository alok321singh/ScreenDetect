package com.myproject;

import android.app.Activity;
import android.database.ContentObserver;
import android.net.Uri;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import android.provider.MediaStore;
import androidx.annotation.NonNull;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class ScreenshotDetectorModule extends ReactContextBaseJavaModule {
    private final ReactApplicationContext reactContext;
    private ContentObserver contentObserver;
    private final Activity.ScreenCaptureCallback screenCaptureCallback;

    public ScreenshotDetectorModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) { // Android 14
            this.screenCaptureCallback = new Activity.ScreenCaptureCallback() {
                @Override
                public void onScreenCaptured() {
                    sendEvent();
                }
            };
        } else {
            this.screenCaptureCallback = null;
        }
    }

    @NonNull
    @Override
    public String getName() {
        return "ScreenshotDetector";
    }

    @ReactMethod
    public void startListening() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) { // Android 14
            Activity activity = getCurrentActivity();
            if (activity != null) {
                activity.registerScreenCaptureCallback(activity.getMainExecutor(), screenCaptureCallback);
            }
        } else {
            registerContentObserver();
        }
    }

    @ReactMethod
    public void stopListening() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) { // Android 14
            Activity activity = getCurrentActivity();
            if (activity != null) {
                activity.unregisterScreenCaptureCallback(screenCaptureCallback);
            }
        } else {
            unregisterContentObserver();
        }
    }

    private void registerContentObserver() {
        Handler handler = new Handler(Looper.getMainLooper());
        contentObserver = new ContentObserver(handler) {
            @Override
            public void onChange(boolean selfChange, Uri uri) {
                if (uri.toString().contains("screenshots")) {
                    sendEvent();
                }
            }
        };
        reactContext.getContentResolver().registerContentObserver(
            MediaStore.Images.Media.EXTERNAL_CONTENT_URI,
            true,
            contentObserver
        );
    }

    private void unregisterContentObserver() {
        if (contentObserver != null) {
            reactContext.getContentResolver().unregisterContentObserver(contentObserver);
            contentObserver = null;
        }
    }

    private void sendEvent() {
        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit("onScreenshotDetected", null);
    }
}
