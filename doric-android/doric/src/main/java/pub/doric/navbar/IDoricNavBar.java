/*
 * Copyright [2019] [Doric.Pub]
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
package pub.doric.navbar;

import android.view.View;

/**
 * @Description: pub.doric.navbar
 * @Author: pengfei.zhou
 * @CreateDate: 2019-11-25
 */
public interface IDoricNavBar {
    boolean isHidden();

    void setHidden(boolean hidden);

    void setTitle(String title);

    void setBackgroundColor(int color);

    void setLeft(View view);

    void setRight(View view);

    void setCenter(View view);
}
