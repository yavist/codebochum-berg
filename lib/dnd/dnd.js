
export const debug = true;

export const viewportWidth = window.innerWidth;
export const viewportHeight = window.innerHeight
export const anchorMargin = 0.025; // out of 1.00

// ipad os 13+ don't report as ipad, so to filter them out, check for MacIntel + touchpoints
let isIOS = /iPad|iPhone|iPod/.test(navigator.platform) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
const IOS_ZOOM_FALLBACK = isIOS;

const zoom = window.mediumZoom('.zoomable', { background: "rgba(0, 0, 0, 0.5)" });
if (IOS_ZOOM_FALLBACK) {
    zoom.on('close', ev => {
        // close instantly
        ev.detail.closeHandler();
    })
}

function getDropZoneStatus() {
    let zones = document.querySelectorAll(".drop-zone");
    let model = {
        dropZones: {}
    }

    for (let zone of zones) {
        if (zone.dataset.id) {
            let id = zone.dataset.id
            model.dropZones[id] = null;

            if (zone.hasChildNodes()) {
                model.dropZones[id] = zone.firstChild.dataset.id;
            }
        }
    }

    return model;
}

export function init() {
    const updateDragPosition = (event) => {
        var target = event.target
        // keep the dragged position in the data-x/data-y attributes
        var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
        var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy

        // translate the element
        target.style.transform = 'translate(' + x + 'px, ' + y + 'px)'
        // update the posiion attributes
        target.setAttribute('data-x', x)
        target.setAttribute('data-y', y)
    }

    interact('.drag-item, .drop-item')
        .draggable({
            inertia: {
                resistance: 30,
                minSpeed: 200,
                endSpeed: 100
            },
            modifiers: [
                interact.modifiers.restrictRect({
                    restriction: 'parent'
                }),
            ],
            listeners: {
                move: updateDragPosition
            },
        })
        .on("dragstart", event => {
            event.target.classList.add("dragging")
            // Bring element in front of its siblings
            event.target.parentNode.appendChild(event.target);

            if (event.target.parentNode.classList.contains("drop-zone")) {
                document.querySelector("#" + event.target.dataset.anchor).appendChild(event.target);
                event.target.style.cssText = event.target.dataset.tempStyle;
            }
        })
        .on("dragend", event => event.target.classList.remove("dragging"))

    interact('.dnd-element')
        .on('doubletap', event => {
            let img = event.target;
            if (img.classList.contains("zoomable")) {
                zoom.attach(img)
                zoom.open(img).then(() => {
                    if (IOS_ZOOM_FALLBACK) {
                        let bigImg = document.querySelector(".medium-zoom-image--opened");
                        let bb = bigImg.getBoundingClientRect();
                        let w = bb.width;
                        let h = bb.height;
                        bigImg.dataset.oldStyle = bigImg.style.cssText;
                        bigImg.style = `width: ${w}px; height: ${h}px; position: absolute; margin: auto; inset: 0;`
                        bigImg.classList.add("no-transition");
                    }

                });
                zoom.detach(img)
            }
        })

    interact('.drop-zone')
        .dropzone({
            accept: '.drop-item',
            checker: (dragEvent, event, dropped, dropzone, dropzoneElement, draggable, draggableElement) => {
                return dropped && !dropzoneElement.hasChildNodes();
            }
        })
        .on('dropactivate', (ev) => {
            let dropZone = ev.target;
            if (!dropZone.hasChildNodes()) ev.target.classList.add('drop-active')
        })
        .on('dropdeactivate', (ev) => {
            ev.target.classList.remove('drop-active')
        })
        .on("drop", (ev) => {
            let droppable = ev.relatedTarget;
            let dropZone = ev.target;

            let zoneRect = interact.getElementRect(dropZone);


            droppable.dataset.tempStyle = droppable.style.cssText;
            droppable.style.transform = "unset";//'translate(' + x + 'px, ' + y + 'px)'
            droppable.style.left = "unset";//0;
            droppable.style.top = "unset";//0;

            dropZone.appendChild(droppable);

            const event = new CustomEvent('dnd:drop', {
                detail: {
                    droppable: droppable.dataset.id,
                    dropZone: dropZone.dataset.id,
                    model: getDropZoneStatus()
                }
            });
            document.dispatchEvent(event);
        })
}