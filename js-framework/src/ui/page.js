"use strict";
exports.__esModule = true;
var Page = /** @class */ (function () {
    function Page() {
    }
    Page.prototype.onCreate = function () { };
    Page.prototype.onDestory = function () { };
    Page.prototype.onShow = function () { };
    Page.prototype.onHidden = function () { };
    /**
     * Native Call
     */
    Page.prototype.__onCreate__ = function () {
        this.onCreate();
    };
    Page.prototype.__onDestory__ = function () {
        this.onDestory();
    };
    Page.prototype.__onShow__ = function () {
        this.onShow();
    };
    Page.prototype.__onHidden__ = function () {
        this.onHidden();
    };
    Page.prototype.__build__ = function () {
        return this.build();
    };
    return Page;
}());
exports.Page = Page;
