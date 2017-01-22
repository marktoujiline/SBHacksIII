package com.example.checkoutuser.myapplication;

import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;


public class SignInFragment extends Fragment implements View.OnClickListener {

    public SignInFragment() {
        // Required empty public constructor
    }

    public static SignInFragment newInstance() {
        SignInFragment fragment = new SignInFragment();
        return fragment;
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_sign_in, container, false);

        final Button btn = (android.widget.Button) view.findViewById(R.id.sign_in_button);
        btn.setOnClickListener(this);
        return view;
    }

    public void onClick(final View v) {
        switch (v.getId()) {
            case R.id.sign_in_button:
                FragmentManager fragmentManager = getFragmentManager();
                fragmentManager.beginTransaction()
                        .replace(R.id.flFragmentPlaceHolder, AddSongsFragment.newInstance()).commit();
                break;
        }
    }


}
