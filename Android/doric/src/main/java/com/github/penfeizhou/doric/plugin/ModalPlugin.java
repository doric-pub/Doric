package com.github.penfeizhou.doric.plugin;

import android.widget.Toast;

import com.github.penfeizhou.doric.DoricContext;
import com.github.penfeizhou.doric.extension.bridge.DoricComponent;
import com.github.penfeizhou.doric.extension.bridge.DoricMethod;
import com.github.penfeizhou.doric.extension.bridge.DoricPromise;
import com.github.penfeizhou.doric.utils.ThreadMode;
import com.github.pengfeizhou.jscore.ArchiveException;
import com.github.pengfeizhou.jscore.JSDecoder;

/**
 * @Description: Doric
 * @Author: pengfei.zhou
 * @CreateDate: 2019-07-18
 */
@DoricComponent(name = "modal")
public class ModalPlugin extends DoricNativePlugin {

    public ModalPlugin(DoricContext doricContext) {
        super(doricContext);
    }

    @DoricMethod(name = "toast", thread = ThreadMode.UI)
    public void toast(JSDecoder decoder, DoricPromise promise) {
        try {
            Toast.makeText(getDoricContext().getContext(), decoder.string(), Toast.LENGTH_SHORT).show();
        } catch (ArchiveException e) {
            e.printStackTrace();
        }
    }
}
