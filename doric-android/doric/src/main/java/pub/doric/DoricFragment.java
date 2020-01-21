/*
 * Copyright [2019] [Doric.Pub]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package pub.doric;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;

import androidx.activity.OnBackPressedCallback;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.navigation.NavController;
import androidx.navigation.Navigation;

/**
 * @Description: pub.doric
 * @Author: pengfei.zhou
 * @CreateDate: 2019-11-23
 */
public class DoricFragment extends Fragment {

    public static DoricFragment newInstance(String scheme, String alias, String extra) {
        Bundle args = new Bundle();
        args.putString("scheme", scheme);
        args.putString("alias", alias);
        args.putString("extra", extra);
        DoricFragment fragment = new DoricFragment();
        fragment.setArguments(args);
        return fragment;
    }

    private View loadingView = null;
    private View errorView = null;

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        OnBackPressedCallback callback = new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                NavController navController = Navigation.findNavController(requireActivity(), R.id.nav_host);
                if (!navController.popBackStack()) {
                    if (getActivity() != null) {
                        getActivity().finish();
                    }
                }
            }
        };
        requireActivity().getOnBackPressedDispatcher().addCallback(this, callback);
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.doric_fragment, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        NavController navController = Navigation.findNavController(requireActivity(), R.id.nav_host);
        navController.setGraph(R.navigation.doric_navigation, getArguments());
        FrameLayout maskView = view.findViewById(R.id.doric_mask);
        if (this.loadingView != null) {
            maskView.addView(this.loadingView);
        }
        if (this.errorView != null) {
            maskView.addView(this.errorView);
        }
    }

    public void setLoadingView(View view) {
        view.setId(R.id.doric_mask_loading);
        this.loadingView = view;
    }

    public void setErrorView(View view) {
        view.setId(R.id.doric_mask_error);
        this.errorView = view;
    }
}
