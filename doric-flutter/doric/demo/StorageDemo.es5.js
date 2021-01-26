'use strict';

var doric = require('doric');

var colors = [
    "#70a1ff",
    "#7bed9f",
    "#ff6b81",
    "#a4b0be",
    "#f0932b",
    "#eb4d4b",
    "#6ab04c",
    "#e056fd",
    "#686de0",
    "#30336b" ].map(function (e) { return doric.Color.parse(e); });
function label(str) {
    return doric.text({
        text: str,
        textSize: 16,
    });
}

var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") { r = Reflect.decorate(decorators, target, key, desc); }
    else { for (var i = decorators.length - 1; i >= 0; i--) { if (d = decorators[i]) { r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r; } } }
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var storedKey = 'StoredKey';
var zone = 'StorageDemo';
var StorageDemo = /*@__PURE__*/(function (Panel) {
    function StorageDemo () {
        Panel.apply(this, arguments);
    }

    if ( Panel ) StorageDemo.__proto__ = Panel;
    StorageDemo.prototype = Object.create( Panel && Panel.prototype );
    StorageDemo.prototype.constructor = StorageDemo;

    StorageDemo.prototype.update = function update () {
        var this$1 = this;

        doric.storage(context).getItem(storedKey, zone).then(function (e) {
            this$1.stored.text = e || "";
            doric.log('Called in then');
        });
    };
    StorageDemo.prototype.build = function build (root) {
        var this$1 = this;

        doric.scroller(doric.vlayout([
            doric.text({
                text: "Storage Demo",
                layoutConfig: doric.layoutConfig().configWidth(doric.LayoutSpec.MOST),
                textSize: 30,
                textColor: doric.Color.WHITE,
                backgroundColor: colors[1],
                textAlignment: doric.gravity().center(),
                height: 50,
            }),
            label('Stored'),
            doric.text({
                layoutConfig: doric.layoutConfig().configWidth(doric.LayoutSpec.MOST),
                textSize: 20,
                textColor: doric.Color.WHITE,
                backgroundColor: colors[3],
                textAlignment: doric.gravity().center(),
                height: 50,
            }).also(function (it) { return this$1.stored = it; }),
            label('store a value').apply({
                width: 200,
                height: 50,
                backgroundColor: colors[0],
                textSize: 30,
                textColor: doric.Color.WHITE,
                layoutConfig: doric.layoutConfig().just(),
                onClick: function () {
                    doric.storage(context).getItem(storedKey, zone).then(function (e) {
                        doric.modal(context).prompt({
                            text: e,
                            title: "Please input text to store",
                            defaultText: "Default Value",
                        }).then(function (text) {
                            doric.storage(context).setItem(storedKey, text, zone).then(function () {
                                this$1.update();
                            });
                        });
                    });
                },
            }),
            label('remove value').apply({
                width: 200,
                height: 50,
                backgroundColor: colors[0],
                textSize: 30,
                textColor: doric.Color.WHITE,
                layoutConfig: doric.layoutConfig().just(),
                onClick: function () {
                    doric.storage(context).remove(storedKey, zone).then(function (e) {
                        this$1.update();
                    });
                },
            }),
            label('clear values').apply({
                width: 200,
                height: 50,
                backgroundColor: colors[0],
                textSize: 30,
                textColor: doric.Color.WHITE,
                layoutConfig: doric.layoutConfig().just(),
                onClick: function () {
                    doric.storage(context).clear(zone).then(function (e) {
                        this$1.update();
                    });
                },
            }) ]).apply({
            layoutConfig: doric.layoutConfig().most().configHeight(doric.LayoutSpec.FIT),
            gravity: doric.gravity().center(),
            space: 10,
        })).apply({
            layoutConfig: doric.layoutConfig().most(),
        }).in(root);
        this.update();
    };

    return StorageDemo;
}(doric.Panel));
StorageDemo = __decorate([
    Entry
], StorageDemo);
//# sourceMappingURL=StorageDemo.es5.js.map
