package pub.doric.plugin;

import android.widget.Toast;

import pub.doric.DoricContext;
import pub.doric.extension.bridge.DoricPlugin;
import pub.doric.extension.bridge.DoricMethod;
import pub.doric.extension.bridge.DoricPromise;
import pub.doric.utils.ThreadMode;
import com.github.pengfeizhou.jscore.ArchiveException;
import com.github.pengfeizhou.jscore.JSDecoder;

/**
 * @Description: Doric
 * @Author: pengfei.zhou
 * @CreateDate: 2019-07-18
 */
@DoricPlugin(name = "modal")
public class ModalPlugin extends DoricJavaPlugin {

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
