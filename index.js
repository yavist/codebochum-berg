//import { infoButton } from "/codebochum-berg/lib/meta/infoButton.js"
//import { showInfoModal } from "/codebochum-berg/lib/meta/modal.js"
import { infoButton } from "/lib/meta/infoButton.js"
import { showInfoModal } from "/lib/meta/modal.js"

/*
let anchor = document.querySelector("#dnd-anchor");



new StaticItem()
    .setImage("/img/direction_l.svg", 80)
    .setPos("0%", "0%")
    .setZoomable(false)
    .append(anchor);

init();
*/

let nord_sound = new Audio('/audio/city.mp3');
let mitte_sound = new Audio('/audio/city.mp3');
let sued_sound = new Audio('/audio/city.mp3');
let wattenscheid_sound = new Audio('/audio/city.mp3');
let suedwest_sound = new Audio('/audio/city.mp3');
let ost_sound = new Audio('/audio/city.mp3');

let orientation = "";
const bubbles = document.querySelectorAll('.bubble');

if (window.innerWidth<750) {
    orientation = "portrait";
    bubbles.forEach(bubble => {
        bubble.classList.add("bubble_portrait")
        bubble.classList.remove(bubble.id.replace("_bubble",""))
    });
} else {
    orientation = "widescreen";
    bubbles.forEach(bubble => {
        bubble.classList.add("bubble_widescreen")
    });
    }



const areas = document.querySelectorAll('.area');

areas.forEach(area => {
  area.addEventListener('click', function handleClick(event) {
    console.log('clicked', event.target.id);
    eval(event.target.id+"_sound").play()
    area.classList.toggle("dark")
    if(orientation=="widescreen"){
        document.querySelector("#"+event.target.id+"_bubble").classList.toggle("visible")
    } else{
        //document.querySelector("#"+event.target.id+"_bubble").classList.remove(event.target.id)
        document.querySelector("#"+event.target.id+"_bubble").classList.toggle("visible")
    }
    
    setTimeout(() => {
        area.classList.toggle("dark");
        if(orientation=="widescreen"){
        document.querySelector("#"+event.target.id+"_bubble").classList.toggle("visible")
        } else {
            document.querySelector("#"+event.target.id+"_bubble").classList.toggle("invisible")
        }
    }, 5000);
   
  });
});

infoButton()
    .click((ev) => {
        showInfoModal("", "Hilfe hilfe hilfe", "Alles klar", "#231955")
    })

showInfoModal("Pagos Saft", "Der Saft ist ganz schön verschüttet. Kümmert euch", "Verstanden", "#231955")
    .then(result => {
        if (result.isConfirmed) {
            // after confirmation
            console.log("Clicked initial info modal!")
        }
    })
/*
document.addEventListener("dnd:drop", (ev) => {
    let allZones = ev.detail.model.dropZones;

    let allCorrect = true;
    for (let zone of Object.entries(allZones)) {
        console.log(zone, allZones[zone])
        if (!zone.every(z => z === zone[0])) {
            allCorrect = false;
            break;
        }
    }
    if (allCorrect) showInfoModal("Alles korrekt!")
})*/



