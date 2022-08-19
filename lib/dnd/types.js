import { debug, viewportWidth as vw, viewportHeight as vh, anchorMargin } from "./dnd.js";
import { getRandomInt } from "./helper.js"


export const ANCHOR_CLASS = "dnd-anchor";
export const DROP_ZONE_CLASS = "drop-zone";
export const DND_ELEMENT_CLASS = "dnd-element";
export const DRAG_ITEM_CLASS = "drag-item";
export const DROP_ITEM_CLASS = "drop-item";
export const STATIC_ITEM_CLASS = "static-item";

export class Element {
    constructor() {
        this.id = null;
        this.tag = "div";
        this.classes = [DND_ELEMENT_CLASS]

        this.x = undefined;
        this.y = undefined;
        this.containerWidth = undefined;
        this.containerHeight = undefined;
        this.renderedInContainer = false;

        this.canZoom = true;

        this.gfx = undefined;
        this.gfxScale = undefined;
        this.backgroundGfx = undefined;
        this.backgroundOptions = {
            size: "100%",
            repeat: "no-repeat",
            position: "center"
        }

        this.style = "";

        this.deferPosition = false;

        this.handlers = {
        }
    }

    get markup() {
        let el = document.createElement(this.tag)
        if (debug) el.dataset.debug = "true"
        if (this.id) el.dataset.id = this.id
        if (this.anchor) el.dataset.anchor = this.anchor.id;

        el.classList.add(...this.classes)

        if (this.style) el.style = this.style;

        if (this.x) el.style.left = this.x;
        if (this.y) el.style.top = this.y;

        let img = null;
        if (this.gfx) {
            img = document.createElement("img");
            img.src = this.gfx;
            img.style.width = "100%"
            img.style.height = "auto";
            if (this.canZoom) {
                img.classList.add("zoomable")
                img.setAttribute('draggable', false);
            }

            el.appendChild(img)
        }

        if (this.renderedInContainer) {
            if (this.containerWidth) el.style.width = this.containerWidth;
            if (this.containerHeight) el.style.height = this.containerHeight;

            if (this.gfx) {
                img.style.width = "auto";
                img.style.height = "auto";
                img.style.margin = "0 auto";
                el.style.overflow = "hidden";
                el.style.justifyContent = "center";
            }

            //el.dataset.zoomSrc = this.gfx;
        }

        if (this.backgroundGfx) {
            el.style.backgroundImage = `url(${this.backgroundGfx})`;
            if (this.backgroundOptions.size) el.style.backgroundSize = this.backgroundOptions.size;
            if (this.backgroundOptions.repeat) el.style.backgroundRepeat = this.backgroundOptions.repeat;
            if (this.backgroundOptions.position) el.style.backgroundPosition = this.backgroundOptions.position;
        }

        // resize observer when width and height are loaded
        if (this.deferPosition || this.gfxScale) {

            let observer = new ResizeObserver((entries) => {
                // gfx scale
                if (this.gfxScale) {
                    let w = el.clientWidth;
                    let h = el.clientHeight;

                    if (!this.renderedInContainer) { // don't set scale width if explicit container width has been set
                        el.style.width = `${w * (this.gfxScale / 100)}px`;
                    }
                }

                // defer placement
                if (this.deferPosition) {
                    let w = el.clientWidth;
                    let h = el.clientHeight;

                    let lowerMargin = anchorMargin;
                    let upperMargin = 1.0 - anchorMargin;

                    this.x = getRandomInt(vw * lowerMargin, (vw - w) * upperMargin) + "px";
                    this.y = getRandomInt(vh * lowerMargin, (vh - h) * upperMargin) + "px";

                    el.style.left = this.x;
                    el.style.top = this.y;
                }

                observer.disconnect()
            });
            observer.observe(el)
        }

        // handlers
        for (let [name, handler] of Object.entries(this.handlers)) {
            el.addEventListener(name, handler)
        }

        return el
    }

    setId(id) {
        this.id = id;
        return this;
    }

    setZoomable(zoomable) {
        this.canZoom = zoomable;
        return this;
    }

    setPos(x, y) {
        // random pos
        if (x === undefined && y === undefined) {
            this.deferPosition = true;
            return this;
        }

        this.x = x ? x : 0;
        this.y = y ? y : 0
        return this;
    }

    setContainerSize(w, h) {
        this.containerWidth = w ? w : undefined;
        this.containerHeight = h ? h : undefined;
        this.renderedInContainer = true;

        return this;
    }

    setImage(imgSrc, imgScale = 100) {
        this.gfx = imgSrc;
        this.gfxScale = imgScale;

        return this;
    }

    setBackgroundImage(imgSrc, options) {
        this.backgroundGfx = imgSrc;
        this.backgroundOptions = options;
        return this;
    }

    setStyle(styleString) {
        let trimmed = styleString.trim();
        if (trimmed.endsWith(";") == false) {
            trimmed += ";";
        }
        this.style += trimmed;

        return this;
    }

    on(handlerName, handler) {
        this.handlers[handlerName] = handler;

        return this;
    }
}

export class StaticItem extends Element {
    constructor() {
        super();
        this.anchor = undefined;
        this.classes = [...this.classes, STATIC_ITEM_CLASS]
    }

    append(anchor) {
        this.anchor = anchor;
        let el = this.markup
        anchor.appendChild(el);
    }
}

export class DraggableItem extends Element {
    constructor() {
        super();
        this.anchor = undefined;
        this.classes = [...this.classes, DRAG_ITEM_CLASS]
    }

    append(anchor) {
        this.anchor = anchor;
        let el = this.markup
        anchor.appendChild(el);
    }
}

export class DroppableItem extends Element {
    constructor() {
        super();
        this.anchor = undefined;
        this.classes = [...this.classes, DROP_ITEM_CLASS]
    }

    append(anchor) {
        this.anchor = anchor;
        let el = this.markup
        anchor.appendChild(el);
    }
}

export class DropZone extends Element {
    constructor() {
        super();
        this.anchor = undefined;
        this.classes = [...this.classes, DROP_ZONE_CLASS]
    }

    get markup() {
        let el = super.markup;

        if (this.x || this.y) {
            el.style.position = "absolute";
        }

        return el;
    }

    append(anchor) {
        this.anchor = anchor;
        let el = this.markup
        anchor.appendChild(el);
    }

    setSize(w, h) {
        this.setContainerSize(w, h)
        return this;
    }
}