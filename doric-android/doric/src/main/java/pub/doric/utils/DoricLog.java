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
package pub.doric.utils;

import android.text.TextUtils;
import android.util.Log;

import pub.doric.Doric;

/**
 * @Description: Doric
 * @Author: pengfei.zhou
 * @CreateDate: 2019-07-18
 */
public class DoricLog {
    private static final String TAG = Doric.class.getSimpleName();


    public static void d(String message, Object... args) {
        Log.d(suffixTag(null), format(message, args));
    }

    public static void w(String message, Object... args) {
        Log.w(suffixTag(null), format(message, args));

    }

    public static void e(String message, Object... args) {
        Log.e(suffixTag(null), format(message, args));
    }

    public static void suffix_d(String suffix, String message, Object... args) {
        Log.d(suffixTag(suffix), format(message, args));
    }

    public static void suffix_w(String suffix, String message, Object... args) {
        Log.w(suffixTag(suffix), format(message, args));
    }

    public static void suffix_e(String suffix, String message, Object... args) {
        Log.e(suffixTag(suffix), format(message, args));
    }

    private static String suffixTag(String suffix) {
        return TextUtils.isEmpty(suffix) ? TAG : TAG + suffix;
    }

    private static String format(String message, Object... args) {
        return String.format(message, args);
    }
}
