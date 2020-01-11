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
package pub.doric;

/**
 * @Description: Monitor status of doric engine
 * @Author: pengfei.zhou
 * @CreateDate: 2020-01-10
 */
public interface IDoricMonitor {
    /**
     * Called when native or js exception occurred in doric
     *
     * @param e exception which is thrown within doric sdk
     * @see com.github.pengfeizhou.jscore.JSRuntimeException
     */
    void onException(Exception e);

    /**
     * @param type    The priority/type of this log message.
     * @param message The message you would like logged.
     * @see android.util.Log#ERROR
     * @see android.util.Log#WARN
     * @see android.util.Log#DEBUG
     */
    void onLog(int type, String message);
}
