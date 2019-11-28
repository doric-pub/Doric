package pub.doric.refresh;

import com.github.pengfeizhou.jscore.JSObject;
import com.github.pengfeizhou.jscore.JSValue;
import com.github.pengfeizhou.jscore.JavaValue;

import pub.doric.DoricContext;
import pub.doric.extension.bridge.DoricMethod;
import pub.doric.extension.bridge.DoricPlugin;
import pub.doric.extension.bridge.DoricPromise;
import pub.doric.shader.SuperNode;
import pub.doric.shader.ViewNode;

/**
 * @Description: pub.doric.pullable
 * @Author: pengfei.zhou
 * @CreateDate: 2019-11-26
 */
@DoricPlugin(name = "Refreshable")
public class RefreshableNode extends SuperNode<DoricSwipeLayout> implements PullingListener {

    private String mContentViewId;
    private ViewNode mContentNode;

    private String mHeaderViewId;
    private ViewNode mHeaderNode;

    public RefreshableNode(DoricContext doricContext) {
        super(doricContext);
    }


    @Override
    protected DoricSwipeLayout build() {
        DoricSwipeLayout doricSwipeLayout = new DoricSwipeLayout(getContext());
        doricSwipeLayout.getRefreshView().setPullingListenr(this);
        return doricSwipeLayout;
    }

    @Override
    protected void blend(DoricSwipeLayout view, String name, JSValue prop) {
        if ("content".equals(name)) {
            mContentViewId = prop.asString().value();
        } else if ("header".equals(name)) {
            mHeaderViewId = prop.asString().value();
        } else if ("onRefresh".equals(name)) {
            final String funcId = prop.asString().value();
            mView.setOnRefreshListener(new DoricSwipeLayout.OnRefreshListener() {
                @Override
                public void onRefresh() {
                    callJSResponse(funcId);
                }
            });
        } else {
            super.blend(view, name, prop);
        }
    }

    @Override
    public void blend(JSObject jsObject) {
        super.blend(jsObject);
        blendContentNode();
        blendHeadNode();
    }


    private void blendContentNode() {
        JSObject contentModel = getSubModel(mContentViewId);
        if (contentModel == null) {
            return;
        }
        String viewId = contentModel.getProperty("id").asString().value();
        String type = contentModel.getProperty("type").asString().value();
        JSObject props = contentModel.getProperty("props").asObject();
        if (mContentNode != null) {
            if (mContentNode.getId().equals(viewId)) {
                //skip
            } else {
                if (mReusable && type.equals(mContentNode.getType())) {
                    mContentNode.setId(viewId);
                    mContentNode.blend(props);
                } else {
                    mView.removeAllViews();
                    mContentNode = ViewNode.create(getDoricContext(), type);
                    mContentNode.setId(viewId);
                    mContentNode.init(this);
                    mContentNode.blend(props);
                    mView.addView(mContentNode.getNodeView());
                }
            }
        } else {
            mContentNode = ViewNode.create(getDoricContext(), type);
            mContentNode.setId(viewId);
            mContentNode.init(this);
            mContentNode.blend(props);
            mView.addView(mContentNode.getNodeView());
        }
    }

    private void blendHeadNode() {
        JSObject headerModel = getSubModel(mHeaderViewId);
        if (headerModel == null) {
            return;
        }
        String viewId = headerModel.getProperty("id").asString().value();
        String type = headerModel.getProperty("type").asString().value();
        JSObject props = headerModel.getProperty("props").asObject();
        if (mHeaderNode != null) {
            if (mHeaderNode.getId().equals(viewId)) {
                //skip
            } else {
                if (mReusable && type.equals(mHeaderNode.getType())) {
                    mHeaderNode.setId(viewId);
                    mHeaderNode.blend(props);
                } else {
                    mHeaderNode = ViewNode.create(getDoricContext(), type);
                    mHeaderNode.setId(viewId);
                    mHeaderNode.init(this);
                    mHeaderNode.blend(props);
                    mView.getRefreshView().setContent(mHeaderNode.getNodeView());
                }
            }
        } else {
            mHeaderNode = ViewNode.create(getDoricContext(), type);
            mHeaderNode.setId(viewId);
            mHeaderNode.init(this);
            mHeaderNode.blend(props);
            mView.getRefreshView().setContent(mHeaderNode.getNodeView());
        }
    }

    @Override
    public ViewNode getSubNodeById(String id) {
        if (id.equals(mContentViewId)) {
            return mContentNode;
        }
        if (id.equals(mHeaderViewId)) {
            return mHeaderNode;
        }
        return null;
    }

    @Override
    protected void blendSubNode(JSObject subProperties) {
        String viewId = subProperties.getProperty("id").asString().value();
        ViewNode node = getSubNodeById(viewId);
        if (node != null) {
            node.blend(subProperties.getProperty("props").asObject());
        }
    }

    @DoricMethod
    public void setRefreshable(JSValue jsValue, DoricPromise doricPromise) {
        boolean refreshable = jsValue.asBoolean().value();
        this.mView.setEnabled(refreshable);
        doricPromise.resolve();
    }

    @DoricMethod
    public void setRefreshing(JSValue jsValue, DoricPromise doricPromise) {
        boolean refreshing = jsValue.asBoolean().value();
        this.mView.setRefreshing(refreshing);
        doricPromise.resolve();
    }

    @DoricMethod
    public void isRefreshable(DoricPromise doricPromise) {
        doricPromise.resolve(new JavaValue(this.mView.isEnabled()));
    }

    @DoricMethod
    public void isRefreshing(DoricPromise doricPromise) {
        doricPromise.resolve(new JavaValue(this.mView.isRefreshing()));
    }

    @Override
    public void startAnimation() {
        if (mHeaderNode != null) {
            mHeaderNode.callJSResponse("startAnimation");
        }
    }

    @Override
    public void stopAnimation() {
        if (mHeaderNode != null) {
            mHeaderNode.callJSResponse("stopAnimation");
        }
    }

    @Override
    public void setProgressRotation(float rotation) {
        if (mHeaderNode != null) {
            mHeaderNode.callJSResponse("setProgressRotation", rotation);
        }
    }
}
