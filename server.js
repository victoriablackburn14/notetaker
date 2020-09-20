var PORT = 3000;

var http= require("http");
var express=require ("express");
var db= require("./db/notesDB.json");
var fs= require("fs");
const path = require("path")
var util= require("util");


const readAsync = util.promisify(fs.readFile);
const writeAsync = util.promisify(fs.writeFile);

var app= express();


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname+"/public"))


app.get("/api/notes", function(req, res){
    console.log("get note")
    async function neededforasyn(){
        try {
            var data = await readAsync(__dirname + "/db/notesDB.json", "UTF-8")
            console.log(data)
            res.json(JSON.parse(data))
        }
        catch {
            res.json([])
        }

    }

    neededforasyn()
});
//post to notesDB.json

var newInput=[
    {userNote:"",}
]
app.post("/api/notes", function (req, res){
    async function write(){
        var userNote= req.body;
        try{
            newInput = await writeAsync(__dirname + "/db/notesDB.json", "UTF-8")
            newInput.userNote = db.replace(/\s+/g, "").toLowerCase();

            console.log(userNote);
            userNote.push(userNote);
        
            res.json(userNote);
        }
        catch{
            res.json([])
        }
    }
    write();   
});

app.get("/notes", function (req, res){
    res.sendFile(path.join(__dirname,"public","notes.html"));
})

app.get("*", function (req, res){
    res.sendFile(path.join(__dirname,"public","index.html"));
})

app.listen(PORT, ()=>{console.log("PORT :" + PORT)})
