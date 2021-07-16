package pub.doric.devkit.ui.treeview;

import android.view.View;

import pub.doric.devkit.R;

public class DoricViewNodeTreeViewBinder extends TreeViewBinder<DoricViewNodeTreeViewBinder.ViewHolder> {

    @Override
    public ViewHolder provideViewHolder(View itemView) {
        return new ViewHolder(itemView);
    }

    @Override
    public void bindView(ViewHolder holder, int position, TreeNode node) {
        DoricViewNodeLayoutItemType layoutItemType = (DoricViewNodeLayoutItemType) node.getContent();
    }

    @Override
    public int getLayoutId() {
        return R.layout.layout_show_node_tree_cell;
    }

    public static class ViewHolder extends TreeViewBinder.ViewHolder {

        public ViewHolder(View rootView) {
            super(rootView);
        }
    }
}
