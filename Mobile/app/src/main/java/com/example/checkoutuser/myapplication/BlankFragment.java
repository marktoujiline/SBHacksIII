package com.example.checkoutuser.myapplication;

import android.content.Context;
import android.net.Uri;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;


public class BlankFragment extends Fragment implements View.OnClickListener{
    private static final String TAG = "bucky";
    public BlankFragment() {
        // Required empty public constructor
    }

    public static Fragment newInstance()
    {
        BlankFragment myFragment = new BlankFragment();
        return myFragment;
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        Log.i(TAG, "Hello");
        View view = inflater.inflate(R.layout.fragment_blank, container, false);
        final Button btn = (Button) view.findViewById(R.id.button3);
        btn.setOnClickListener(this);
        Log.i(TAG, "HI");

// Instantiate the RequestQueue.
        RequestQueue queue = Volley.newRequestQueue(getActivity());
        String url ="http://sample-env.45vkx9bmj8.us-west-2.elasticbeanstalk.com/";
        //String url = "https://google.com";

// Request a string response from the provided URL.
        StringRequest stringRequest = new StringRequest(Request.Method.GET, url,
                new Response.Listener<String>() {
                    @Override
                    public void onResponse(String response) {
                        // Display the first 500 characters of the response string.
                        btn.setText("Response is: " + response.toString());//+ response.substring(0,500));
                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Log.i(TAG, error.toString());
                btn.setText("That didn't work!");
            }
        });
// Add the request to the RequestQueue.
        queue.add(stringRequest);


        return view;
    }
    public void onClick(final View v) {
        switch (v.getId()) {
            case R.id.button3:
                Log.i(TAG, "SUP");
                break;
        }
    }
}
