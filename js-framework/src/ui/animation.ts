import { Panel } from "./panel"
import { takeLet } from "../pattern/candies"
import { O_TRUNC } from "constants"
import { modal } from "../native/modal"

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

export enum RepeatMode {
    RESTART,
    REVERSE,
}

export class Animation {
    duration = 100
    startDelay = 0
    repeatCount = 1
    repeatMode = RepeatMode.RESTART
}

export class AnimationSetBuilder {
    currentNode: Node
    group: AnimationSet

    constructor(group: AnimationSet, anim: Animation) {
        this.currentNode = group.getNodeForAnimation(anim)
        this.group = group
    }

    with(animation: Animation) {
        const node = this.group.getNodeForAnimation(animation)
        this.currentNode.addSibling(node)
        return this
    }

    after(animation: Animation) {
        const node = this.group.getNodeForAnimation(animation)
        this.currentNode.addParent(node)
        return this
    }

    before(animation: Animation) {
        const node = this.group.getNodeForAnimation(animation)
        this.currentNode.addChild(node)
        return this
    }
}
class Node {
    children: Set<Node> = new Set
    siblings: Set<Node> = new Set
    parents: Set<Node> = new Set
    animation: Animation
    built = false

    constructor(anim: Animation) {
        this.animation = anim
    }

    addParent(node: Node) {
        if (!this.parents.has(node)) {
            this.parents.add(node);
            node.addChild(this);
        }
    }

    addSibling(node: Node) {
        if (!this.siblings.has(node)) {
            this.siblings.add(node);
            node.addSibling(this);
        }
    }

    addChild(node: Node) {
        if (!this.children.has(node)) {
            this.children.add(node)
            node.addParent(this)
        }
    }
}
export class AnimationSet {
    nodeMap: Map<Animation, Node> = new Map
    nodes: Node[] = []

    getNodeForAnimation(anim: Animation) {
        let node = this.nodeMap.get(anim)
        if (node === undefined) {
            node = new Node(anim)
            this.nodeMap.set(anim, node)
            this.nodes.push(node)
        }
        return node;
    }
    play(animation: Animation) {
        return new AnimationSetBuilder(this, animation)
    }

    playTogether(animations: Animation[]) {
        if (animations.length == 1) {
            this.play(animations[0]);
        } else {
            for (let i = 0; i < animations.length - 1; i++) {
                this.play(animations[i]).with(animations[i + 1])
            }
        }
    }

    playSequentially(animations: Animation[]) {
        if (animations.length == 1) {
            this.play(animations[0]);
        } else {
            for (let i = 0; i < animations.length - 1; i++) {
                this.play(animations[i]).before(animations[i + 1])
            }
        }
    }
    findSiblings(node: Node, siblings: Set<Node>) {
        if (!siblings.has(node)) {
            siblings.add(node)
            node.siblings.forEach(e => {
                this.findSiblings(e, siblings)
            })
        }
    }
    createDependencyGraph() {
        this.nodes.forEach(node => {
            if (node.built) {
                return
            }
            this.findSiblings(node, node.siblings)
            node.siblings.delete(node)
            node.siblings.forEach(e => {
                e.parents.forEach(p => {
                    node.addParent(p)
                })
            })
            node.built = true

            node.siblings.forEach(s => {
                node.parents.forEach(p => {
                    s.addParent(p)
                })
                s.built = true
            })
        })
    }
}

export function animator(panel: Panel) {
    return (args: {
        animations: () => void,
        duration: number,
        complete?: () => void
    }) => {
        takeLet(panel.context.shader)(it => {
            it.animator().then(() => {
                args.animations()
                return takeLet(panel.getRootView())(root => {
                    if (root.isDirty()) {
                        const model = root.toModel();
                        (model as any).duration = args.duration
                        const ret = it.animateRender(model)
                        root.clean()
                        return ret
                    }
                    for (let v of panel.allHeadViews()) {
                        if (v.isDirty()) {
                            const model = v.toModel()
                            const ret = it.animateRender(model)
                            it.clean()
                            return ret
                        }
                    }
                })
            }).then(() => {
                if (args.complete) {
                    args.complete()
                }
            })
        })
    }
}