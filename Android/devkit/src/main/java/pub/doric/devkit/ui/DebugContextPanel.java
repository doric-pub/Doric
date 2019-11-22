package pub.doric.devkit.ui;

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

import java.util.ArrayList;

import pub.doric.devkit.BuildConfig;
import pub.doric.devkit.DataModel;
import pub.doric.devkit.DoricDev;
import pub.doric.devkit.IDevKit;
import pub.doric.devkit.R;

public class DebugContextPanel extends DialogFragment {

    private ArrayList<DataModel> dataModels;

    public DebugContextPanel(ArrayList<DataModel> dataModels) {
        this.dataModels = dataModels;
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

        for (final DataModel dataModel : dataModels) {
            View cell = inflater.inflate(R.layout.layout_debug_context_cell, container, false);

            TextView contextIdTextView = cell.findViewById(R.id.context_id_text_view);
            contextIdTextView.setText(dataModel.contextId);

            TextView sourceTextView = cell.findViewById(R.id.source_text_view);
            sourceTextView.setText(dataModel.source);

            cell.findViewById(R.id.debug_text_view).setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    JsonObject jsonObject = new JsonObject();
                    jsonObject.addProperty("contextId", dataModel.contextId);
                    jsonObject.addProperty("projectHome", BuildConfig.PROJECT_HOME);
                    jsonObject.addProperty("source", dataModel.source.replace(".js", ".ts"));
                    DoricDev.sendDevCommand(IDevKit.Command.DEBUG, jsonObject);
                    dismissAllowingStateLoss();
                }
            });

            container.addView(cell);
        }
    }
}
