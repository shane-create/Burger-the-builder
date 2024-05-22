var dbScore = {
    "data": []
}

var db = JSON.parse(localStorage.getItem("scoreDB", JSON.stringify(dbScore) ))
db.data.sort((a,b)=>b.score-a.score);
console.log(db.data)