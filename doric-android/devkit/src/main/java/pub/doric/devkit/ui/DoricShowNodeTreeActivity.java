/*
 * Copyright [2021] [Doric.Pub]
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
package pub.doric.devkit.ui;

import android.os.Bundle;

import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedList;
import java.util.List;
import java.util.Queue;

import pub.doric.devkit.R;
import pub.doric.devkit.ui.treeview.DoricViewNodeLayoutItemType;
import pub.doric.devkit.ui.treeview.DoricViewNodeTreeViewBinder;
import pub.doric.devkit.ui.treeview.TreeNode;
import pub.doric.devkit.ui.treeview.TreeViewAdapter;
import pub.doric.shader.GroupNode;
import pub.doric.shader.ViewNode;

public class DoricShowNodeTreeActivity extends DoricDevBaseActivity {

    private RecyclerView rv;
    private TreeViewAdapter adapter;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

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