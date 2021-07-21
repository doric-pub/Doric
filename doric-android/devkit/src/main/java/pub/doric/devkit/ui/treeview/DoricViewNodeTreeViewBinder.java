package pub.doric.devkit.ui.treeview;

import android.view.View;
import android.widget.TextView;

import java.util.Set;

import pub.doric.devkit.R;
import pub.doric.shader.GroupNode;
import pub.doric.shader.RootNode;
import pub.doric.shader.SuperNode;
import pub.doric.shader.ViewNode;

public class DoricViewNodeTreeViewBinder extends TreeViewBinder<DoricViewNodeTreeViewBinder.ViewHolder> {

    @Override
    public ViewHolder provideViewHolder(View itemView) {
        return new ViewHolder(itemView);
    }

    @Override
    public void bindView(ViewHolder holder, int position, TreeNode node) {
        DoricViewNodeLayoutItemType layoutItemType = (DoricViewNodeLayoutItemType) node.getContent();

        ViewNode viewNode = layoutItemType.viewNode;
        String type = viewNode.getType();
        if (viewNode instanceof RootNode) {
            type = "Root";
        }
        String viewId = " <" + viewNode.getId() + "> ";

        String value = type + viewId;
        if (viewNode instanceof GroupNode) {
            GroupNode groupNode = (GroupNode) viewNode;
            String childDesc = "(" + groupNode.getChildNodes().size() + " Child)";
            value = value + childDesc;
        } else if (viewNode instanceof SuperNode) {
            SuperNode superNode = (SuperNode) viewNode;
            Set<String> viewIds = superNode.getSubNodeViewIds();
            String childDesc = "(" + viewIds.size() + " Child)";
            value = value + childDesc;
        }
        holder.nodeName.setText(value);
    }

    @Override
    public int getLayoutId() {
        return R.layout.layout_show_node_tree_cell;
    }

    public static class ViewHolder extends TreeViewBinder.ViewHolder {

        public TextView nodeName;

        public ViewHolder(View rootView) {
            super(rootView);

            this.nodeName = rootView.findViewById(R.id.node_type_tv);
        }
    }
}
