package com.example.checkoutuser.myapplication;

import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;

import com.android.volley.AuthFailureError;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.VolleyLog;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.UnsupportedEncodingException;


public class AddSongsFragment extends Fragment implements View.OnClickListener{
    private static final String TAG = "bucky";
    public AddSongsFragment() {
        // Required empty public constructor
    }

    public static Fragment newInstance()
    {
        AddSongsFragment myFragment = new AddSongsFragment();
        return myFragment;
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState){
        // Inflate the layout for this fragment
        Log.i(TAG, "Hello");
        View view = inflater.inflate(R.layout.fragment_add_song, container, false);
        final Button btn = (Button) view.findViewById(R.id.addSong);
        btn.setOnClickListener(this);
        Log.i(TAG, "HI");

// Instantiate the RequestQueue.
        return view;
    }
    public void onClick(final View v) {
        switch (v.getId()) {
            case R.id.addSong:
                try {
                    RequestQueue queue = Volley.newRequestQueue(getActivity());
                    String url = "http://sample-env.45vkx9bmj8.us-west-2.elasticbeanstalk.com/";
                    //String url = "https://google.com";
                    JSONObject jsonBody = new JSONObject();
                    Log.i("bucky", "edit");
                    EditText edit = (EditText) this.getActivity().findViewById(R.id.editText);
                    Log.i("bucky", "edittt");
                    String result = edit.getText().toString();
                    Log.i("bucky", result);
                    jsonBody.put("url", result);
                    jsonBody.put("user", "Mark");
                    final String requestBody = jsonBody.toString();

// Request a string response from the provided URL.
                    Log.i("bucky", "1");
                    StringRequest stringRequest = new StringRequest(Request.Method.POST, url + "addSong",
                            new Response.Listener<String>() {
                                @Override
                                public void onResponse(String response) {
                                    Log.i("bucky", response.toString());
                                    // Display the first 500 characters of the response string.
                                    //btn.setText("Response is: " + response.toString());//+ response.substring(0,500));
                                }
                            },
                            new Response.ErrorListener() {
                                @Override
                                public void onErrorResponse(VolleyError error) {
                                    Log.i("bucky", error.toString());
                                }
                            }) {
                        @Override
                        public String getBodyContentType() {
                            return "application/json; charset=utf-8";
                        }

                        @Override
                        public byte[] getBody()  throws AuthFailureError{
                            try {
                                Log.i("bucky", requestBody.toString());
                                Log.i("bucky", "3");
                                return requestBody == null ? null : requestBody.getBytes("utf-8");
                            } catch (UnsupportedEncodingException uee) {
                                Log.i("bucky", "Unsupported Encoding while trying to get the bytes of %s using %s");
                                return null;
                            }
                        }
                    };
// Add the request to the RequestQueue.
                    queue.add(stringRequest);
                }
                catch (JSONException j){
                    Log.i("bucky", "JSON EXCEPTION");
                }
                break;
        }
    }
}
