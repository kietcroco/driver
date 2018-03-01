package com.itvinadriver;

import android.content.Intent;
import com.facebook.react.ReactActivity;
import com.reactnativecomponent.splashscreen.RCTSplashScreen;
import android.widget.ImageView;
import android.os.Bundle;
//import android.util.Log;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return BuildConfig.APP_NAME;
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        MainApplication.getCallbackManager().onActivityResult(requestCode, resultCode, data);
    }

    @Override
	protected void onCreate(Bundle savedInstanceState) {
	    //RCTSplashScreen.openSplashScreen(this);   //open splashscreen
	    RCTSplashScreen.openSplashScreen(this, true, ImageView.ScaleType.FIT_XY);   //open splashscreen fullscreen
	    super.onCreate(savedInstanceState);
	}
}
