/* Her får jeg mit vindues højde såvel som bredde. */
var b = window.innerWidth;
var h = window.innerHeight;
const max_afvigelse = b - 2 * (b / 5); 
const halfRange = max_afvigelse / 2; 

/* Struktur af score database */
var dbScore = {
    "data": [],
    "nyestesScore":0,
}

/* Hvis scoreDB ikke eksisterer på localstorage så lav det: */

if(!localStorage.getItem("scoreDB")){
    localStorage.setItem("scoreDB", JSON.stringify(dbScore))
}

//localStorage.removeItem("scoreDB")

var db = JSON.parse(localStorage.getItem("scoreDB"))
console.log(db)

/* Dette her er alle mine elementer som jeg gør brug af. */
var mand = document.getElementById("mand")
var burgerTop = document.getElementById("burgerTop");
var løg = document.getElementById("løg");
var mayo = document.getElementById("mayo");
var ost = document.getElementById("ost");
var kød = document.getElementById("kød");
var tomater = document.getElementById("tomater");
var salat = document.getElementById("salat");
var burgerBund = document.getElementById("burgerBund");

var scoreShow = document.getElementById("scoreNum")

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
    console.log(rect1.left + rect1.width/2)
    var rect1X = rect1.left + rect1.width/2
    var rect2X = rect2.left + rect2.width/2
    var centerDist = Math.abs(rect1X - rect2X);
    var normalizedCenterDist = centerDist/halfRange
    alleCenterDist.push(normalizedCenterDist)
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

function endGame(){
    var total = 0;

    for(let i = 0; i < alleCenterDist.length; i++){
        let this_dist = alleCenterDist[i]
        let procent_afvigelse = (Math.exp(-5 * this_dist))*100
        console.log('procent afvigelse for denne dims ', procent_afvigelse)
        total += procent_afvigelse
    }

    var dato = new Date()
    var å = dato.getUTCFullYear()
    var m = dato.getUTCMonth() + 1
    var d = dato.getUTCDate()

    var regnetScore = total/7
    var scoreObject = {
        score: regnetScore,
        år: å,
        måned: m,
        dag:d
    }

    db.data.push(scoreObject)
    db.nyestesScore = scoreObject;
    
    localStorage.setItem("scoreDB", JSON.stringify(db))


    setTimeout(function(){mand.src = "../images/grib.png"}, 200)
    setTimeout(function(){mand.src = "../images/gribTættere.png"}, 400)
    setTimeout(function(){
        mand.src = "../images/spis.png"
        burgerBund.style.display = "none"
        salat.style.display = "none"
        tomater.style.display = "none"
        kød.style.display = "none"
        ost.style.display = "none"
        mayo.style.display = "none"
        løg.style.display = "none"
        burgerTop.style.display = "none"
    }, 600)
    setTimeout(function(){mand.src = "../images/tørMund.png"}, 900)
    setTimeout(function(){mand.src = "../images/givScore.png"}, 1500)
    setTimeout(function(){
        mand.src = "../images/visScore.png"
        scoreShow.style.display = "block"
        scoreShow.textContent = parseInt(regnetScore) + "%"
    }, 1900)

    setTimeout(function(){
        window.location.href = "score.html"
    }, 3500)

    console.log(regnetScore)
}

function begyndBurgertop(){
    burgerTop.style.display = "block";
    acceleration = 0;
    mand.src = "../images/superGlad.png"
    initializeBevægelse(burgerTop, 5, løg, endGame)
}

function begyndLøg(){
    løg.style.display = "block";
    acceleration = 0;
    mand.src = "../images/shockGlad.png"
    initializeBevægelse(løg, 5, mayo, begyndBurgertop)
}

function begyndMayo(){
    mayo.style.display = "block";
    acceleration = 0;
    mand.src = "../images/fuldShock.png"
    initializeBevægelse(mayo, 5, ost, begyndLøg)
}

function begyndOst(){
    ost.style.display = "block";
    acceleration = 0;
    mand.src = "../images/sur.png"
    initializeBevægelse(ost, 4, kød, begyndMayo)
}

function begyndKød(){
    kød.style.display = "block";
    acceleration = 0;
    mand.src = "../images/irriteret.png"
    initializeBevægelse(kød, 3, tomater, begyndOst)
}

function begyndTomater(){
    tomater.style.display = "block";
    mand.src = "../images/meh.png"
    acceleration = 0;
    initializeBevægelse(tomater, 2, salat, begyndKød)
}

initializeBevægelse(salat, 1, burgerBund, begyndTomater)

