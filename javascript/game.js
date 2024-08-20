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

/* Her tjekker jeg om den given element1 rører element 2. */
function tjekForCollide(rect1, rect2){
    /* Dette retunerer sandt så længe INGEN af følgende er true, og flask hvis bare en af dem er true. */
    return !(rect1.right < rect2.left ||  rect1.left > rect2.right ||  rect1.bottom < rect2.top || rect1.top > rect2.bottom);
}

/* Her regner jeg frem til afstanden mellem elemnt 1s center x pos, og burger bundens x pos */
function tjekForDist(rect1){
    var rect2 = burgerBund.getBoundingClientRect();
    console.log(rect1.left + rect1.width/2)
    var rect1X = rect1.left + rect1.width/2
    var rect2X = rect2.left + rect2.width/2
    /* Her finder jeg forskellen for at beregne afstanden. REsultat vil altid være et positivt tal. */
    var centerDist = Math.abs(rect1X - rect2X);
    /* Jeg normaliserer aftanden ud fra halvdelen af min range. At normalisere betyder at bringe alle værdierne til en ens range. */
    var normalizedCenterDist = centerDist/halfRange
    alleCenterDist.push(normalizedCenterDist)
}

/* Fald funktion tager 2 elementer, et interval og en callback */
function fald(element1, element2, faldInterval, callback = null) {
    /* hvis element 1 ikke længere falder så retunerer vi og afslutter intervallet */
    if(!element1.faldTilstand) return;

    /* Laver en rect objekt af elementer */
    var rect1 = element1.getBoundingClientRect();
    var rect2 = element2.getBoundingClientRect();

    /* finder element 1 top koordinater */
    /* geboundingclientrect top er relativ til synspunktet så den ændres hvis man fx scroller på websiden.
    Men offsettop er statisk og altid i forhold til skærmen. */
    let top = element1.offsetTop;

    /* Her kører jeg en tjekforcollide funktion, der retunerer om 2 elementer rører ved hinanden ved noget punkt. */
    if(tjekForCollide(rect1, rect2)){
        /* Jeg bruger en anden funktion for at tjekke aftsanden mellem elements central x og burgerbunds central x */
        tjekForDist(rect1)
        /* Afslutter hidtil kørende interval og sætter elementets faldtistand til falsk */
        clearInterval(faldInterval);
        element1.faldTilstand = false
        if(callback) callback()
        /* En anden if, for at se om elementet rører bunden af skærmen. */
    } else if(rect1.bottom > h){
        tjekForDist(rect1)
        clearInterval(faldInterval)
        element1.faldTilstand = false
        if(callback) callback()
        /* Hvi element ikke rører bund eller det forrige element så skal den 
        blive ved med at acclere mod bunden. */
    } else {
        /* gravity er 0.1 og accelerationen starter ud med at være 0 */
        acceleration += gravity;

        /* da en interval kører denne funktion, vil elementet blive ved med at falde 
        med en stigende acceleration indtil intervallet afsluttes */
        element1.style.top = (top + acceleration) + 'px';
    }
}

/* Dette er min begynd fald function. Den tager 4 parametere. Et element, elementet den skal ramme i, en interval og en callback. */
function begyndFald(element, collideElement, sideTilSideInterval, callback = null) {
    /* Jeg tejkker om der bliver klikket på skærmen. Hvis der gør det, starter jeg tjekKlik functionen. */
    document.addEventListener('click', function tjekClick() {
        /* Hvis elmentet allerede har en faldtilstand der er lig med sand, returnerer vi ud af vores tjekClick function.
        Vi vil nemlig ikke have at elmentet falder fra toppen igen og igen. */
        if (element.faldTilstand) return; 

        /* Vi sletter sideTilSide intervallet, da vores element ikke længere skal gå fra side til side. */
        clearInterval(sideTilSideInterval);
        /* Vi sætter accelerationen til at være -4 til at starte med, så den går lidt op før den falder. */
        acceleration = -4;
        /* Vi sætter elementet faldtilstand til sand. */
        element.faldTilstand = true;

        /* Her starter vi faldIntervalet og kalder fald functionen. */
        var faldInterval = setInterval(fald, intervalTid, element, collideElement, faldInterval, callback);
        /* Vi sletter vores eventlistener, da vi ikke vil have at der er flere kørende på samme tid. */
        document.removeEventListener('click', tjekClick);
    });
}

/* Dette er vores initialize bevægelse. Den starter bevægelsen for hvert element. 
Den tager en 2 elementer, en hastighed og en callback. */
function initializeBevægelse(element, hastighed, collideElement, callback = null){
    /* Vi laver en retnings egenskab på vores bevægende element og sætter den til at være 1. */
    element.retning = 1;
    /* Derefter laver vi en faldtilstand til den som er lig falsk. */
    element.faldTilstand = false
    /* Vi starter vores side til side interval. */
    var sideTilSideInterval = setInterval(sideTilSide, intervalTid, element, hastighed)
    /* Vi kalder også begyndfald funktionen som konstant tjekker om der bliver klikket på skærmen. */
    begyndFald(element, collideElement, sideTilSideInterval, callback)
}

/* Dette er vores endgame callback. */

function endGame(){
    /* Den laver en ny variabel total. */
    var total = 0;

    /* Vi looper igennem vores værdier i arrayet */
    for(let i = 0; i < alleCenterDist.length; i++){
        /* Vi gemmer elementet ved index i. */
        let this_dist = alleCenterDist[i]
        /* Og beregner den procent afvigelse ud af 100. */
        /* Math expt tager en parameter x, som i dette tilfælde er (-5 * this_dist) 
        og sætter eulers tal til at exponerer med x. Dette sørger for, at den procent afvigelse
        er mindre jo længere væk fra centrum afstanden er. */
        let procent_afvigelse = (Math.exp(-5 * this_dist))*100
        console.log('procent afvigelse for denne dims ', procent_afvigelse)
        /* Vi tilsætter denne værdi til totalen. */
        total += procent_afvigelse
    }

    /* Her finder vi lige datoen for i dag. */
    var dato = new Date()
    var å = dato.getUTCFullYear()
    var m = dato.getUTCMonth() + 1
    var d = dato.getUTCDate()
    
    /* Den regnede score bliver totalen og antal elementer i aftsandsdisten. 
    Jeg har bare skrevet 7 her, fordi jeg vidste at det alligevel bare ville v
    ære max 7 værdier i arrayet alligevel.*/
    var regnetScore = total/7
    var scoreObject = {
        score: regnetScore,
        år: å,
        måned: m,
        dag:d
    }

    /* Jeg tilføjer min scoreObject til min db.data array */
    db.data.push(scoreObject)
    /* Dette var noget jeg ikke ente med at bruge. */
    db.nyestesScore = scoreObject;

    /* Og gemmer det på local storage: */
    localStorage.setItem("scoreDB", JSON.stringify(db))

    /* Set timeouts der kører funktioner for at lave min animation. */
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
    /* Skifter til sidst til min score page */
    setTimeout(function(){
        window.location.href = "score.html"
    }, 3500)

    console.log(regnetScore)
}

/* Dette er vores sidste element og den kalder på den sidste callback, hvilket er endgame callbacken. */
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

/* Denne funktion viser først tomat elementet, ved at ændre dens display til block, 
den ændrer mandens src image så han skifter ansigts udtryk, og sætter accelerationen til 0 igen. */
function begyndTomater(){
    tomater.style.display = "block";
    mand.src = "../images/meh.png"
    acceleration = 0;
    /* Den starter så et nyt interval, nu med nye værdier og en ny callback! */
    initializeBevægelse(tomater, 2, salat, begyndKød)
}

/* Dette er vores første element der starter det hele så snart spillet starter. 
Dens callback er den funktionen begyndtomater ovenover der begynder så snart calbacken kaldes,
hvilket sker i fald funktionen. */
initializeBevægelse(salat, 1, burgerBund, begyndTomater)

