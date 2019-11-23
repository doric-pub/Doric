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

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

import pub.doric.async.AsyncResult;
import pub.doric.loader.DoricJSLoaderManager;
import pub.doric.navigator.IDoricNavigator;
import pub.doric.utils.DoricLog;

/**
 * @Description: pub.doric
 * @Author: pengfei.zhou
 * @CreateDate: 2019-11-23
 */
public class DoricPanelFragment extends Fragment {
    private DoricPanel doricPanel;

    public static DoricPanelFragment newInstance(String scheme, String alias) {
        Bundle args = new Bundle();
        args.putString("scheme", scheme);
        args.putString("alias", alias);
        DoricPanelFragment fragment = new DoricPanelFragment();
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        doricPanel = (DoricPanel) inflater.inflate(R.layout.doric_framgent_panel, container, false);
        return doricPanel;
    }


    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        Bundle argument = getArguments();
        if (argument == null) {
            DoricLog.e("DoricPanelFragment argument is null");
            return;
        }
        final String alias = argument.getString("alias");
        String scheme = argument.getString("scheme");
        DoricJSLoaderManager.getInstance().loadJSBundle(scheme).setCallback(new AsyncResult.Callback<String>() {
            @Override
            public void onResult(String result) {
                doricPanel.config(result, alias);
                DoricContext context = doricPanel.getDoricContext();
                Fragment fragment = getParentFragment();
                if (fragment instanceof IDoricNavigator) {
                    context.setDoricNavigator((IDoricNavigator) fragment);
                }
            }

            @Override
            public void onError(Throwable t) {
                DoricLog.e("DoricPanelFragment load JS error:" + t.getLocalizedMessage());
            }

            @Override
            public void onFinish() {

            }
        });
    }
}
