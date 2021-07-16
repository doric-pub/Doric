package pub.doric.devkit.ui;

import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedList;
import java.util.List;
import java.util.Queue;

import pub.doric.DoricContext;
import pub.doric.DoricContextManager;
import pub.doric.devkit.R;
import pub.doric.devkit.ui.treeview.DoricViewNodeLayoutItemType;
import pub.doric.devkit.ui.treeview.DoricViewNodeTreeViewBinder;
import pub.doric.devkit.ui.treeview.TreeNode;
import pub.doric.devkit.ui.treeview.TreeViewAdapter;
import pub.doric.shader.GroupNode;
import pub.doric.shader.ViewNode;

public class DoricShowNodeTreeActivity extends AppCompatActivity {

    public static final String DORIC_CONTEXT_ID_KEY = "DORIC_CONTEXT_ID";

    private RecyclerView rv;
    private TreeViewAdapter adapter;

    private DoricContext doricContext;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        String contextId = getIntent().getStringExtra(DORIC_CONTEXT_ID_KEY);
        doricContext = DoricContextManager.getContext(contextId);

        setContentView(R.layout.layout_show_node_tree);
        initView();
        initData();
    }

    private void initData() {
        List<TreeNode> nodes = new ArrayList<>();
        TreeNode<DoricViewNodeLayoutItemType> root = new TreeNode<>(new DoricViewNodeLayoutItemType(doricContext.getRootNode()));

        Queue<ViewNode> viewQueue = new LinkedList<>();
        Queue<TreeNode> treeQueue = new LinkedList<>();

        viewQueue.offer(doricContext.getRootNode());
        treeQueue.offer(root);

        while (!viewQueue.isEmpty()) {
            ViewNode viewNode = viewQueue.poll();
            TreeNode treeNode = treeQueue.poll();
            if (viewNode instanceof GroupNode) {
                GroupNode groupNode = (GroupNode) viewNode;
                for (int i = 0; i != groupNode.getChildNodes().size(); i++) {
                    assert treeNode != null;
                    TreeNode<DoricViewNodeLayoutItemType> temp = new TreeNode(new DoricViewNodeLayoutItemType((ViewNode) groupNode.getChildNodes().get(i)));
                    treeNode.addChild(temp);

                    viewQueue.offer((ViewNode) groupNode.getChildNodes().get(i));
                    treeQueue.offer(temp);
                }
            }
        }

        nodes.add(root);

        rv.setLayoutManager(new LinearLayoutManager(this));
        adapter = new TreeViewAdapter(nodes, Collections.singletonList(new DoricViewNodeTreeViewBinder()));
        // whether collapse child nodes when their parent node was close.
//        adapter.ifCollapseChildWhileCollapseParent(true);
        adapter.setOnTreeNodeListener(new TreeViewAdapter.OnTreeNodeListener() {
            @Override
            public boolean onClick(TreeNode node, RecyclerView.ViewHolder holder) {
                if (!node.isLeaf()) {
                    //Update and toggle the node.
                    onToggle(!node.isExpand(), holder);
//                    if (!node.isExpand())
//                        adapter.collapseBrotherNode(node);
                }
                return false;
            }

            @Override
            public void onToggle(boolean isExpand, RecyclerView.ViewHolder holder) {
                DoricViewNodeTreeViewBinder.ViewHolder viewNodeTreeViewBinder = (DoricViewNodeTreeViewBinder.ViewHolder) holder;
            }
        });
        rv.setAdapter(adapter);
    }

    private void initView() {
        rv = findViewById(R.id.show_node_tree_rv);
    }
}