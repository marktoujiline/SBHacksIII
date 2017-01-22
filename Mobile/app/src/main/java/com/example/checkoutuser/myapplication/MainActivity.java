package com.example.checkoutuser.myapplication;

import android.app.ProgressDialog;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Rect;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentTransaction;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.MotionEvent;
import android.view.View;
import android.view.inputmethod.InputMethodManager;
import android.widget.EditText;

import com.spotify.sdk.android.authentication.AuthenticationClient;
import com.spotify.sdk.android.authentication.AuthenticationRequest;
import com.spotify.sdk.android.authentication.AuthenticationResponse;

import org.json.JSONObject;

import java.util.Timer;
import java.util.TimerTask;

public class MainActivity extends AppCompatActivity {

    private static final String TAG = "muusic";
    private static final String CLIENT_ID = "be98b68099c643d59f9105eaf96cb6ed";
    private static final int REQUEST_CODE = 1337;
    private static final String REDIRECT_URI = "http://sample-env.45vkx9bmj8.us-west-2.elasticbeanstalk.com";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        if (savedInstanceState == null) {
            //Authenticate spotify
            try {
                AuthenticationRequest.Builder builder =
                        new AuthenticationRequest.Builder(CLIENT_ID, AuthenticationResponse.Type.TOKEN, REDIRECT_URI);
                builder.setScopes(new String[]{"user-top-read"});
                AuthenticationRequest request = builder.build();
                AuthenticationClient.openLoginActivity(this, REQUEST_CODE, request);
            } catch(Exception e) {
                Log.i(TAG, "Spotify authentication issue " + e.toString());
            }
        }
        //Fake progress bar
        try {
            ProgressDialog progress = new ProgressDialog(this);
            progress.setMessage("Downloading Music :) ");
            progress.setProgressStyle(ProgressDialog.STYLE_HORIZONTAL);
            progress.setIndeterminate(true);
        } catch (Exception e) {
            Log.i(TAG, "Fake progress bar failing " + e.toString());
        }
        //Set up fragment container
        try {
            FragmentManager fragmentManager = getSupportFragmentManager();
            fragmentManager.beginTransaction()
                    .replace(R.id.flFragmentPlaceHolder, WelcomeFragment.newInstance()).commit();
        } catch (Exception e){
            Log.i(TAG, "fragment replacement failed " + e.toString());
        }
        new Timer().schedule(new TimerTask() {
            @Override
            public void run() {
                FragmentTransaction transaction = getSupportFragmentManager().beginTransaction();
                transaction.setCustomAnimations(R.anim.enter_from_right, R.anim.exit_to_left, R.anim.enter_from_left, R.anim.exit_to_right);
                transaction.replace(R.id.flFragmentPlaceHolder, AddSongsFragment.newInstance()).commit();
            }
        }, 4000);
    }

    protected void onActivityResult(int requestCode, int resultCode, Intent intent) {
        super.onActivityResult(requestCode, resultCode, intent);
        // Check if result comes from the correct activity
        if (requestCode == REQUEST_CODE) {
            AuthenticationResponse response = AuthenticationClient.getResponse(resultCode, intent);
            switch (response.getType()) {
                // Response was successful and contains auth token
                case TOKEN:
                    SharedPreferences sp = getPreferences(Context.MODE_PRIVATE);
                    SharedPreferences.Editor editor = sp.edit();
                    editor.putString("user_token", response.getAccessToken());
                    editor.commit();
                    break;
                // Auth flow returned an error
                case ERROR:
                    Log.i(TAG, "onActivityResult error occurred");
                    break;
            }
        } else {
            Log.i(TAG, "Request code != REQUEST_CODE");
        }
    }

    //For EditText to get out of focus when clicked elsewhere
    @Override
    public boolean dispatchTouchEvent(MotionEvent event) {
        if (event.getAction() == MotionEvent.ACTION_DOWN) {
            View v = getCurrentFocus();
            if ( v instanceof EditText) {
                Rect outRect = new Rect();
                v.getGlobalVisibleRect(outRect);
                if (!outRect.contains((int)event.getRawX(), (int)event.getRawY())) {
                    v.clearFocus();
                    InputMethodManager imm = (InputMethodManager) getSystemService(Context.INPUT_METHOD_SERVICE);
                    imm.hideSoftInputFromWindow(v.getWindowToken(), 0);
                }
            }
        }
        return super.dispatchTouchEvent( event );
    }
}
