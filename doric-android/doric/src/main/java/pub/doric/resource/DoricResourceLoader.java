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
package pub.doric.resource;

import pub.doric.DoricContext;

/**
 * @Description: For loading resources
 * @Author: pengfei.zhou
 * @CreateDate: 2021/10/20
 */
public interface DoricResourceLoader {
    /**
     * Determines which type's resource this loader could load
     *
     * @return type's name of this resource loader
     */
    String resourceType();

    /**
     * Load resource by identifier in your way
     *
     * @param doricContext which context current running
     * @param identifier   Identifies the resource
     * @return Resource's inputStream
     */
    DoricResource load(DoricContext doricContext, String identifier);
}
