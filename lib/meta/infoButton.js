export function infoButton() {
    let button = document.createElement("a");
    button.innerHTML = "ℹ️";
    button.style.cssText = `position: absolute; top: 8px; right: 8px; user-select: none; cursor: pointer; font-size: 4em;`

    document.body.appendChild(button);

    return {
        click: handler => {
            button.addEventListener("click", (ev) => {
                handler(ev)
            })
        }
    }
}