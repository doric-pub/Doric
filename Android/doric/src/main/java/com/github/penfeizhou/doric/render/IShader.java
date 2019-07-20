package com.github.penfeizhou.doric.render;

import com.github.pengfeizhou.jscore.JSValue;

/**
 * @Description: com.github.penfeizhou.doric.render
 * @Author: pengfei.zhou
 * @CreateDate: 2019-07-20
 */
public interface IShader {
    ViewNode create(String type);

    boolean blend(ViewNode node, String propertyName, JSValue property);
}
