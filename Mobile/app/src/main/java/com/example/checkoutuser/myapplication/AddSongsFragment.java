package com.example.checkoutuser.myapplication;

import android.content.Context;
import android.content.SharedPreferences;
import android.graphics.Rect;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v4.util.ArrayMap;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.inputmethod.InputMethodManager;
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
import java.util.Map;


public class AddSongsFragment extends Fragment implements View.OnClickListener{
    String topTracks = "";
    private static final String TAG = "bucky";
    String url = "https://muusealert.herokuapp.com/";
    public AddSongsFragment() {
        // Required empty public constructor
    }

    public static Fragment newInstance()
    {
        AddSongsFragment myFragment = new AddSongsFragment();
        myFragment.setRetainInstance(true);
        return myFragment;
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState){


        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_add_song, container, false);

        final Button btn = (Button) view.findViewById(R.id.addSong);
        btn.setOnClickListener(this);

        RequestQueue queue = Volley.newRequestQueue(getActivity());


        SharedPreferences sp = getActivity().getPreferences(Context.MODE_PRIVATE);

        //get toptracks

        final Map<String, String> mHeaders = new ArrayMap<String, String>();
        mHeaders.put("Authorization", "Bearer " + sp.getString("user_token", "mark"));

        StringRequest stringRequest = new StringRequest(Request.Method.GET, "https://api.spotify.com/v1/me/top/tracks",
                new Response.Listener<String>() {
                    @Override
                    public void onResponse(String response) {
                        topTracks = response.toString();

                        //Send tracks to server
                        RequestQueue queue = Volley.newRequestQueue(getActivity());
                        StringRequest stringRequest = new StringRequest(Request.Method.POST, url + "addPlaylist",
                                new Response.Listener<String>() {
                                    @Override
                                    public void onResponse(String response) {
                                        topTracks = response.toString();
                                        //topTracks = response;
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
                                    Log.i("bucky", topTracks);
                                    return topTracks == null ? null : topTracks.getBytes("utf-8");
                                } catch (UnsupportedEncodingException uee) {
                                    Log.i("bucky", "bad error");
                                    return null;
                                }
                            }
                        };
                        queue.add(stringRequest);
                        //topTracks = response;

                    }
                },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        Log.i("bucky", error.toString());
                    }
                }) {
            public Map<String, String> getHeaders() {
                return mHeaders;
            }
        };
        queue.add(stringRequest);
        return view;
    }

    public void onClick(final View v) {
        switch (v.getId()) {
            case R.id.addSong:
                try {
                    v.findViewById(R.id.addSong).setEnabled(false);
                    v.findViewById(R.id.addSong).postDelayed(new Runnable() {
                        @Override
                        public void run() {
                            v.findViewById(R.id.addSong).setEnabled(true);
                        }
                    }, 10000);
                    SharedPreferences sp = getActivity().getPreferences(Context.MODE_PRIVATE);
                    RequestQueue queue = Volley.newRequestQueue(getActivity());
                    String url = "https://muusealert.herokuapp.com/";

                    JSONObject json = new JSONObject();

                    //Song Name
                    EditText edit = (EditText) this.getActivity().findViewById(R.id.editText);
                    String songName = edit.getText().toString();
                    json.put("url", songName);

                    //User Name
                    Log.i("bucky", sp.getAll().toString());
                    json.put("user", sp.getString("user_token", "Mark"));
                    final String requestBody = json.toString();

                    StringRequest stringRequest = new StringRequest(Request.Method.POST, url + "addSongByUrl",
                            new Response.Listener<String>() {
                                @Override
                                public void onResponse(String response) {
                                    Log.i("bucky", response.toString());
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
                                return requestBody == null ? null : requestBody.getBytes("utf-8");
                            } catch (UnsupportedEncodingException uee) {
                                return null;
                            }
                        }
                    };
                    queue.add(stringRequest);
                }
                catch (JSONException j){
                    Log.i("bucky", "JSON EXCEPTION");
                }
                break;
        }
    }
}
