package pub.doric.devkit.ui.treeview;

import pub.doric.devkit.R;
import pub.doric.shader.ViewNode;

public class DoricViewNodeLayoutItemType implements LayoutItemType {
    private final ViewNode viewNode;

    public DoricViewNodeLayoutItemType(ViewNode viewNode) {
        this.viewNode = viewNode;
    }

    @Override
    public int getLayoutId() {
        return R.layout.layout_show_node_tree_cell;
    }
}
