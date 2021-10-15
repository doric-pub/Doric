package pub.doric.shader.richtext;
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

import android.text.Editable;
import android.text.Spanned;
import android.text.TextUtils;
import android.text.style.AbsoluteSizeSpan;

import org.xml.sax.Attributes;

import java.util.Stack;

/**
 * @Description: pub.doric.shader.richtext
 * @Author: pengfei.zhou
 * @CreateDate: 2020-04-14
 */
public class CustomTagHandler implements HtmlParser.TagHandler {
    private final Stack<Integer> startIndex = new Stack<>();

    /**
     * html attribute value，like:<size value='16'></size>
     */
    private final Stack<String> propertyValue = new Stack<>();

    @Override
    public boolean handleTag(boolean opening, String tag, Editable output, Attributes attributes) {
        if (opening) {
            handleStartTag(tag, output, attributes);
        } else {
            handleEndTag(tag, output, attributes);
        }
        return false;
    }

    private void handleStartTag(String tag, Editable output, Attributes attributes) {
        if (tag.equalsIgnoreCase("font")) {
            handleStartFont(output, attributes);
        }
    }


    private void handleEndTag(String tag, Editable output, Attributes attributes) {
        if (tag.equalsIgnoreCase("font")) {
            handleEndFont(output);
        }
    }


    private void handleStartFont(Editable output, Attributes attributes) {
        startIndex.push(output.length());
        propertyValue.push(HtmlParser.getValue(attributes, "size"));
    }


    /**
     * <font  size='4'></font>
     * * * 1-9
     * * * 2-10
     * * * 3-12
     * * * 4-14
     * * * 5-18
     * * * 6-24
     * * * 7-36
     */
    private void handleEndFont(Editable output) {
        String val = propertyValue.pop();
        if (!TextUtils.isEmpty(val)) {
            int value = 12;
            try {
                value = Integer.parseInt(val);
            } catch (Exception e) {
                e.printStackTrace();
            }
            switch (value) {
                case 1:
                    value = 9;
                    break;
                case 2:
                    value = 10;
                    break;
                case 4:
                    value = 14;
                    break;
                case 5:
                    value = 18;
                    break;
                case 6:
                    value = 24;
                    break;
                case 7:
                    value = 36;
                    break;
                default:
                    value = 12;
                    break;
            }
            output.setSpan(new AbsoluteSizeSpan(value, true), startIndex.pop(), output.length(), Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
        }
    }
}