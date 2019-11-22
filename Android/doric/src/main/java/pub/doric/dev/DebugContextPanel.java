package pub.doric.dev;

import android.app.Dialog;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.DialogFragment;

import com.google.gson.JsonObject;

import pub.doric.BuildConfig;
import pub.doric.Doric;
import pub.doric.DoricContext;
import pub.doric.DoricContextManager;
import pub.doric.R;

public class DebugContextPanel extends DialogFragment {
    @Nullable
    @Override
    public View onCreateView(
            @NonNull LayoutInflater inflater,
            @Nullable ViewGroup container,
            @Nullable Bundle savedInstanceState
    ) {
        return inflater.inflate(R.layout.layout_debug_context, container, false);
    }

    @Override
    public Dialog onCreateDialog(Bundle savedInstanceState) {
        Dialog dialog = super.onCreateDialog(savedInstanceState);
        dialog.getWindow().requestFeature(Window.FEATURE_NO_TITLE);

        return dialog;
    }

    @Override
    public void onStart() {
        super.onStart();

        Dialog dialog = getDialog();
        if (dialog != null) {
            dialog.getWindow().setLayout(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT);
        }

        LinearLayout container = getView().findViewById(R.id.container);
        LayoutInflater inflater = LayoutInflater.from(getContext());

        for (final DoricContext doricContext : DoricContextManager.aliveContexts()) {
            View cell = inflater.inflate(R.layout.layout_debug_context_cell, container, false);

            TextView contextIdTextView = cell.findViewById(R.id.context_id_text_view);
            contextIdTextView.setText(doricContext.getContextId());

            TextView sourceTextView = cell.findViewById(R.id.source_text_view);
            sourceTextView.setText(doricContext.getSource());

            cell.findViewById(R.id.debug_text_view).setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    JsonObject jsonObject = new JsonObject();
                    jsonObject.addProperty("contextId", doricContext.getContextId());
                    jsonObject.addProperty("projectHome", BuildConfig.PROJECT_HOME);
                    jsonObject.addProperty("source", doricContext.getSource().replace(".js", ".ts"));
                    Doric.sendDevCommand(IDevKit.Command.DEBUG, jsonObject);
                    dismissAllowingStateLoss();
                }
            });

            container.addView(cell);
        }
    }
}
