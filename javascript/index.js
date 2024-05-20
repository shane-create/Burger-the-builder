/* Her får jeg mit vindues højde såvel som bredde. */
var b = window.innerWidth;
var h = window.innerHeight;

/* Dette her er alle mine elementer som jeg gør brug af. */
var burgerTop = document.getElementById("burgerTop");
var løg = document.getElementById("løg");
var mayo = document.getElementById("mayo");
var ost = document.getElementById("ost");
var kød = document.getElementById("kød");
var tomater = document.getElementById("tomater");
var salat = document.getElementById("salat");
var burgerBund = document.getElementById("burgerBund");

/* Her får jeg lavet en liste med alle de forskellige afstande fra de forskellige 
burger elementers x centrum til x centrummet af min burger bund. */
var alleCenterDist = [];

/* Dette er den universale intervaltid jeg gør brug af. */
var intervalTid = 10;

/* Dette er med den styrke jeg vil have mine elementer til at falde, såvel som den
acceleration de starter ud med. */
var gravity = 0.1
var acceleration = 0;

/* Her er funktionen der bevæger mine elementer fra højre til ventre side. */
function sideTilSide(element, hastighed) {
    /* Jeg finder positionen af min venstre side af mit element */
    var venstre = element.offsetLeft;

    /* Derefter højre side */
    var højre = venstre + element.offsetWidth;

    /* Hvis ventre side bliver lavere end bredden af skærmen / 5, skifter den retning */
    if (venstre < b/5) {
        element.retning = 1; 
    /* Den skifter også retning hvis højre side går længere en bredden af skærmen minus bredden / 5 */
    } else if (højre > b-b/5) {
        element.retning = -1;
    }
     /* Her får jeg elementet til at bevæge sig */
    element.style.left = (venstre + (hastighed * element.retning)) + 'px';

 }

function tjekForCollide(rect1, rect2){

    return !(rect1.right < rect2.left ||  rect1.left > rect2.right ||  rect1.bottom < rect2.top || rect1.top > rect2.bottom);
}

function tjekForDist(rect1){
    var rect2 = burgerBund.getBoundingClientRect();
    
    var rect1X = (rect1.left + rect1.width)/2
    var rect2X = (rect2.left + rect2.width)/2
    var centerDist = Math.abs(rect1X - rect2X);
    alleCenterDist.push(centerDist)
    console.log(alleCenterDist)
}

function fald(element1, element2, faldInterval, callback = null) {
    if(!element1.faldTilstand) return;
    var rect1 = element1.getBoundingClientRect();
    var rect2 = element2.getBoundingClientRect();
    let top = element1.offsetTop;

    if(tjekForCollide(rect1, rect2)){
        tjekForDist(rect1)
        clearInterval(faldInterval);
        element1.faldTilstand = false
        if(callback) callback()
    } else if(rect1.bottom > h){
        tjekForDist(rect1)
        clearInterval(faldInterval)
        element1.faldTilstand = false
        if(callback) callback()
    } else {
        acceleration += gravity;

        element1.style.top = (top + acceleration) + 'px';
    }
}

function begyndFald(element, collideElement, sideTilSideInterval, callback = null) {
    document.addEventListener('click', function tjekClick() {
        if (element.faldTilstand) return; 

        clearInterval(sideTilSideInterval);
        acceleration = -4;
        element.faldTilstand = true;
        var faldInterval = setInterval(fald, intervalTid, element, collideElement, faldInterval, callback);
        document.removeEventListener('click', tjekClick);
    });
}

function initializeBevægelse(element, hastighed, collideElement, callback = null){
    element.retning = 1;
    element.faldTilstand = false
    var sideTilSideInterval = setInterval(sideTilSide, intervalTid, element, hastighed)
    begyndFald(element, collideElement, sideTilSideInterval, callback)
}

function begyndBurgertop(){
    burgerTop.style.display = "block";
    acceleration = 0;
    initializeBevægelse(burgerTop, 5, løg)
}

function begyndLøg(){
    løg.style.display = "block";
    acceleration = 0;
    initializeBevægelse(løg, 5, mayo, begyndBurgertop)
}

function begyndMayo(){
    mayo.style.display = "block";
    acceleration = 0;
    initializeBevægelse(mayo, 5, ost, begyndLøg)
}

function begyndOst(){
    ost.style.display = "block";
    acceleration = 0;
    initializeBevægelse(ost, 5, kød, begyndMayo)
}

function begyndKød(){
    kød.style.display = "block";
    acceleration = 0;
    initializeBevægelse(kød, 4, tomater, begyndOst)
}

function begyndTomater(){
    tomater.style.display = "block";
    acceleration = 0;
    initializeBevægelse(tomater, 3, salat, begyndKød)
}

initializeBevægelse(salat, 2, burgerBund, begyndTomater)

