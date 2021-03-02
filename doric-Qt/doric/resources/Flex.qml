import QtQuick 2.12
import QtQuick.Layouts 1.15
import pub.doric.widget 1.0

Rectangle {
    id: flex

    property int minHeight: 0
    property int minWidth: 0

    property int flexShrink: 0
    property int flexGrow: 0

    property int marginTop: 0
    property int marginLeft: 0
    property int marginRight: 0
    property int marginBottom: 0

    property int paddingTop: 0
    property int paddingLeft: 0
    property int paddingRight: 0
    property int paddingBottom: 0

    property string alignContent: "auto"
    property string alignItems: "auto"
    property string alignSelf: "auto"

    property string justifyContent: "flexStart"

    property string display: "flex"

    property string flexWrap: "noWrap"

    property string flexDirection: "row"

    FlexLayoutService {
        id: flexLayoutService
    }

    function isFlex(child) {
        if (typeof child.flexShrink === 'undefined') {
            return false;
        } else if (typeof child.flexGrow === 'undefined') {
            return false;
        } else if (typeof child.minHeight === 'undefined') {
            return false;
        } else if (typeof child.minWidth === 'undefined') {
            return false;
        } else if (typeof child.marginTop === 'undefined') {
            return false;
        } else if (typeof child.marginLeft === 'undefined') {
            return false;
        } else if (typeof child.marginRight === 'undefined') {
            return false;
        } else if (typeof child.marginBottom === 'undefined') {
            return false;
        } else if (typeof child.paddingTop === 'undefined') {
            return false;
        } else if (typeof child.paddingLeft === 'undefined') {
            return false;
        } else if (typeof child.paddingRight === 'undefined') {
            return false;
        } else if (typeof child.paddingBottom === 'undefined') {
            return false;
        } else if (typeof child.alignContent === 'undefined') {
            return false;
        } else if (typeof child.alignItems === 'undefined') {
            return false;
        } else if (typeof child.alignSelf === 'undefined') {
            return false;
        } else if (typeof child.justifyContent === 'undefined') {
            return false;
        } else if (typeof child.display === 'undefined') {
            return false;
        } else if (typeof child.flexWrap === 'undefined') {
            return false;
        } else if (typeof child.flexDirection === 'undefined') {
            return false;
        } else {
            return true;
        }
    }

    function setAlignContent(child, node) {
        var align = child.alignContent;
        if (align === "auto") {
            node.setAlignContentAuto();
        } else if (align === "flexStart") {
            node.setAlignContentFlexStart();
        } else if (align === "center") {
            node.setAlignContentCenter();
        } else if (align === "flexEnd") {
            node.setAlignContentFlexEnd();
        } else if (align === "stretch") {
            node.setAlignContentStretch();
        } else if (align === "baseline") {
            node.setAlignContentBaseline();
        } else if (align === "spaceBetween") {
            node.setAlignContentSpaceBetween();
        } else if (align === "spaceAround") {
            node.setAlignContentSpaceAround();
        } else {
            throw "setAlignContent invalid param";
        }
    }

    function setAlignItems(child, node) {
        var align = child.alignItems;
        if (align === "auto") {
            node.setAlignItemsAuto();
        } else if (align === "flexStart") {
            node.setAlignItemsFlexStart();
        } else if (align === "center") {
            node.setAlignItemsCenter();
        } else if (align === "flexEnd") {
            node.setAlignItemsFlexEnd();
        } else if (align === "stretch") {
            node.setAlignItemsStretch();
        } else if (align === "baseline") {
            node.setAlignItemsBaseline();
        } else if (align === "spaceBetween") {
            node.setAlignItemsSpaceBetween();
        } else if (align === "spaceAround") {
            node.setAlignItemsSpaceAround();
        } else {
            throw "setAlignItems invalid param";
        }
    }

    function setAlignSelf(child, node) {
        var align = child.alignSelf;
        if (align === "auto") {
            node.setAlignSelfAuto();
        } else if (align === "flexStart") {
            node.setAlignSelfFlexStart();
        } else if (align === "center") {
            node.setAlignSelfCenter();
        } else if (align === "flexEnd") {
            node.setAlignSelfFlexEnd();
        } else if (align === "stretch") {
            node.setAlignSelfStretch();
        } else if (align === "baseline") {
            node.setAlignSelfBaseline();
        } else if (align === "spaceBetween") {
            node.setAlignSelfSpaceBetween();
        } else if (align === "spaceAround") {
            node.setAlignSelfSpaceAround();
        } else {
            throw "setAlignSelf invalid param";
        }
    }

    function setDisplay(child, node) {
        var display = child.display;
        if (display === "flex") {
            node.setDisplayFlex();
        } else if (display === "none") {
            node.setDisplayNone();
        } else {
            throw "setDisplay invalid param";
        }
    }

    function setJustifyContent(child, node) {
        var justify = child.justifyContent;
        if (justify === "center") {
            node.setJustifyCenter();
        } else if (justify === "flexEnd") {
            node.setJustifyFlexEnd();
        } else if (justify === "flexStart") {
            node.setJustifyFlexStart();
        } else if (justify === "spaceAround") {
            node.setJustifySpaceAround();
        } else if (justify === "spaceEvenly") {
            node.setJustifySpaceEvenly();
        } else if (justify === "spaceBetween") {
            node.setJustifySpaceBetween();
        } else {
            throw "setJustifyContent invalid param";
        }
    }

    function setFlexWrap(child, node) {
        var wrap = child.flexWrap;
        if (wrap === "wrap") {
            node.setWrap();
        } else if (wrap === "noWrap") {
            node.setNoWrap();
        } else if (wrap === "wrapReverse") {
            node.setWrapReverse();
        } else {
            throw "setFlexWrap invalid param";
        }
    }

    function setFlexDirection(child, node) {
        var direction = child.flexDirection;
        if (direction === "row") {
            node.setFlexDirectionRow();
        } else if (direction === "column") {
            node.setFlexDirectionColumn();
        } else if (direction === "rowReverse") {
            node.setFlexDirectionRowReverse();
        } else if (direction === "columnReverse") {
            node.setFlexDirectionColumnReverse();
        } else {
            throw "setFlexDirection invalid param";
        }
    }

    function setOtherNodeProps(child, node) {
        node.minHeight = child.minHeight;
        node.minWidth = child.minWidth;
        node.flexShrink = child.flexShrink;
        node.flexGrow = child.flexGrow;

        node.marginTop = child.marginTop;
        node.marginLeft = child.marginLeft;
        node.marginRight = child.marginRight;
        node.marginBottom = child.marginBottom;

        node.paddingTop = child.paddingTop;
        node.paddingLeft = child.paddingLeft;
        node.paddingRight = child.paddingRight;
        node.paddingBottom = child.paddingBottom;

        node.height = child.height;
        node.width = child.width;
    }

    function setDefaultNodeProps(child, node) {
        node.minHeight = 9999;
        node.minWidth = 0;
        node.flexShrink = 0;
        node.flexGrow = 0;

        node.marginTop = 0;
        node.marginLeft = 0;
        node.marginRight = 0;
        node.marginBottom = 0;

        node.paddingTop = 0;
        node.paddingLeft = 0;
        node.paddingRight = 0;
        node.paddingBottom = 0;

        node.height = child.height;
        node.width = child.width;

        node.setDisplayFlex();

        node.setAlignSelfAuto();
        node.setAlignItemsAuto();
        node.setAlignContentAuto();

        node.setJustifySpaceBetween();
        node.setNoWrap();

        node.setFlexDirectionRow();
    }

    function processNode(child, node) {
        setOtherNodeProps(child, node, true);
        setJustifyContent(child, node);
        setFlexDirection(child, node);
        setAlignContent(child, node);
        setAlignItems(child, node);
        setAlignSelf(child, node);
        setFlexWrap(child, node);
        setDisplay(child, node);
    }

    function updatePositions() {
        if (flex.height !== 0 && flex.width !== 0) {
            var rootNode = flexLayoutService.createNode();
            processNode(flex, rootNode);
            var nodes = []
            var node = {}
            var child = {}
            var i = 0;
            for (i = 0; i !== flex.children.length; i++) {
                node = flexLayoutService.createNode();
                child = flex.children[i];
                if (isFlex(child)) {
                    processNode(child, node);
                } else {
                    setDefaultNodeProps(child, node);
                }
                nodes.push(node);
            }
            rootNode.appendChildren(nodes);
            rootNode.calculateLayoutLtr(flex.width, flex.height);
            /* console.log(JSON.stringify({root: rootNode})); */
            for (i = 0; i !== flex.children.length; i++) {
                node = nodes[i];
                flex.children[i].x = node.getLayoutLeft();
                flex.children[i].y = node.getLayoutTop();
                flex.children[i].width = node.getLayoutWidth();
                flex.children[i].height = node.getLayoutHeight();
                /* console.log(JSON.stringify(node)); */
            }
            flexLayoutService.collectGarbage(rootNode);
            return true;
        } else {
            return false;
        }
    }

    onChildrenChanged: updatePositions();
    onWidthChanged: updatePositions();
    onHeightChanged: updatePositions();
}
