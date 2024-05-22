var dbScore = {
    "data": []
}

var db = JSON.parse(localStorage.getItem("scoreDB", JSON.stringify(dbScore) ))
db.data.sort((a,b)=>b.score-a.score);
console.log(db.data)

var gold = document.getElementById("gold")
var silver = document.getElementById("silver")
var bronze = document.getElementById("bronze")
var firstScore = document.getElementById("firstScore")
var secondScore = document.getElementById("secondScore")
var thirdScore = document.getElementById("thirdScore")
var fourthScore = document.getElementById("fourthScore")
var fifthScore = document.getElementById("fifthScore")

var firstDate = document.getElementById("firstDate")
var secondDate = document.getElementById("secondDate")
var thirdDate = document.getElementById("thirdDate")
var fourthDate = document.getElementById("fourthDate")
var fifthDate = document.getElementById("fifthDate")

if(db.data.length >= 5){
    fifthScore.textContent = parseInt(db.data[4].score) + "%"
    fifthDate.textContent = db.data[4].dag + "/" + db.data[4].måned + "/" + db.data[4].år
}

if(db.data.length >= 4){
    fourthScore.textContent = parseInt(db.data[3].score) + "%"
    fourthDate.textContent = db.data[3].dag + "/" + db.data[3].måned + "/" + db.data[3].år
}

if(db.data.length >= 3){
    bronze.style.display = "block";
    thirdScore.textContent = parseInt(db.data[2].score) + "%"
    thirdDate.textContent = db.data[2].dag + "/" + db.data[2].måned + "/" + db.data[2].år
}

if(db.data.length >= 2){
    silver.style.display = "block";
    secondScore.textContent = parseInt(db.data[1].score) + "%"
    secondDate.textContent = db.data[1].dag + "/" + db.data[1].måned + "/" + db.data[1].år
} 

if(db.data.length >= 1){
    gold.style.display = "block";
    firstScore.textContent = parseInt(db.data[0].score) + "%"
    firstDate.textContent = db.data[0].dag + "/" + db.data[0].måned + "/" + db.data[0].år
}