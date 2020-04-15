import doric.*

class __$__ : Panel() {
    override fun build(rootView: Group) {
        val text = Text()
        var number = 1
        text.text = "Hello,Doric"
        text.layoutConfig = layoutConfig().fit().configAlignment(Gravity().center())
        text.textColor = Color.RED
        text.textSize = 20
        text.onClick = {
            modal(context).alert("Clicked")
            text.text = "${number++}"
        }
        rootView.addChild(text)
    }
}

fun main() {
    Entry(__$__::class.js)
}