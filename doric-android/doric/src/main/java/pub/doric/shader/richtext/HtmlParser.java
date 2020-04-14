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
import android.text.Html;
import android.text.Spanned;

import org.xml.sax.Attributes;
import org.xml.sax.ContentHandler;
import org.xml.sax.Locator;
import org.xml.sax.SAXException;
import org.xml.sax.XMLReader;

import java.util.ArrayDeque;

/**
 * @Description: pub.doric.shader.richtext
 * @Author: pengfei.zhou
 * @CreateDate: 2020-04-14
 */
public class HtmlParser implements Html.TagHandler, ContentHandler {

    //This approach has the advantage that it allows to disable processing of some tags while using default processing for others,
    // e.g. you can make sure that ImageSpan objects are not created:
    public interface TagHandler {
        // return true here to indicate that this tag was handled and
        // should not be processed further
        boolean handleTag(boolean opening, String tag, Editable output, Attributes attributes);
    }

    public static Spanned buildSpannedText(String html, Html.ImageGetter imageGetter, TagHandler handler) {
        return Html.fromHtml("<inject/>" + html, imageGetter, new HtmlParser(handler));
    }

    public static String getValue(Attributes attributes, String name) {
        for (int i = 0, n = attributes.getLength(); i < n; i++) {
            if (name.equals(attributes.getLocalName(i)))
                return attributes.getValue(i);
        }
        return null;
    }

    private final TagHandler handler;

    private ContentHandler mInnerContentHandler;
    private Editable mEditable;
    private ArrayDeque<Boolean> tagStatus = new ArrayDeque<>();

    private HtmlParser(TagHandler handler) {
        this.handler = handler;
    }

    @Override
    public void handleTag(boolean opening, String tag, Editable output, XMLReader xmlReader) {
        if (mInnerContentHandler == null) {
            // record result object
            mEditable = output;
            // record current content handler
            mInnerContentHandler = xmlReader.getContentHandler();
            // replace content handler with our own that forwards to calls to original when needed
            xmlReader.setContentHandler(this);
            // handle endElement() callback for <inject/> tag
            tagStatus.addLast(Boolean.FALSE);
        }
    }

    @Override
    public void setDocumentLocator(Locator locator) {
        mInnerContentHandler.setDocumentLocator(locator);
    }

    @Override
    public void startDocument() throws SAXException {
        mInnerContentHandler.startDocument();
    }

    @Override
    public void endDocument() throws SAXException {
        mInnerContentHandler.endDocument();
    }

    @Override
    public void startPrefixMapping(String prefix, String uri) throws SAXException {
        mInnerContentHandler.startPrefixMapping(prefix, uri);
    }

    @Override
    public void endPrefixMapping(String prefix) throws SAXException {
        mInnerContentHandler.endPrefixMapping(prefix);
    }

    @Override
    public void startElement(String uri, String localName, String qName, Attributes attributes) throws SAXException {
        boolean isHandled = handler.handleTag(true, localName, mEditable, attributes);
        tagStatus.addLast(isHandled);
        if (!isHandled) {
            mInnerContentHandler.startElement(uri, localName, qName, attributes);
        }
    }

    @Override
    public void endElement(String uri, String localName, String qName) throws SAXException {
        if (!tagStatus.removeLast()) {
            mInnerContentHandler.endElement(uri, localName, qName);
        }
        handler.handleTag(false, localName, mEditable, null);
    }

    @Override
    public void characters(char[] ch, int start, int length) throws SAXException {
        mInnerContentHandler.characters(ch, start, length);
    }

    @Override
    public void ignorableWhitespace(char[] ch, int start, int length) throws SAXException {
        mInnerContentHandler.ignorableWhitespace(ch, start, length);
    }

    @Override
    public void processingInstruction(String target, String data) throws SAXException {
        mInnerContentHandler.processingInstruction(target, data);
    }

    @Override
    public void skippedEntity(String name) throws SAXException {
        mInnerContentHandler.skippedEntity(name);
    }
}