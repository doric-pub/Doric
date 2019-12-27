package pub.doric.devkit.ui;

import android.app.Dialog;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.v4.app.DialogFragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.google.gson.JsonObject;

import org.greenrobot.eventbus.EventBus;

import pub.doric.DoricContext;
import pub.doric.DoricContextManager;
import pub.doric.devkit.DoricDev;
import pub.doric.devkit.IDevKit;
import pub.doric.devkit.R;
import pub.doric.devkit.event.StartDebugEvent;

public class DebugContextPanel extends DialogFragment {

    public DebugContextPanel() {
    }

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
                    EventBus.getDefault().post(new StartDebugEvent(doricContext.getContextId()));
                    JsonObject jsonObject = new JsonObject();
                    jsonObject.addProperty("contextId", doricContext.getContextId());
                    jsonObject.addProperty("source", doricContext.getSource().replace(".js", ".ts"));
                    DoricDev.sendDevCommand(IDevKit.Command.DEBUG, jsonObject);
                    dismissAllowingStateLoss();
                }
            });

            container.addView(cell);
        }
    }
}
