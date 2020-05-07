
const express = require("express")
const edit_json_file = require("edit-json-file")
const path = require("path")
const body_parser = require("body-parser")

const app = express()

app.set("view engine", "pug")
app.set("views", path.join(__dirname, "views"))
app.use(express.static(path.join(__dirname, "public")))
app.use(body_parser.urlencoded({extended : true}))

//DB



const low = require("lowdb")
const FileSync = require("lowdb/adapters/FileSync")

const adapter = new FileSync("db.json")
const db = low(adapter)

 //init db
db.defaults({users: [], data_types: []})
    .write()

const query = (table) => (action) => (object) => {
    db.get(table)
        [action](object)
        .write()
}
const add_user = query("users")("push")
const add_data_type = query("data_types")("push")

add_data_type("camion")


const leo = {email:"leocrapart@yahoo.fr", password:"leo", status:"admin" }
const enzo = {email:"crapartenzo@yahoo.fr", password: "enzo", status:"customer"}

const users = db.get("users")
                .value()

const data_types = db.get("data_types")
                    .value()
console.log("good")
console.log("and nice")
app.get("/", (req, res) => {
    res.render("index", {
        users: users,
        data_types: data_types
    })
})

app.post("/update_record", (req, res) => {
    const id_email = req.body.id_email
    const data_types = db.get("data_types")
    
    for (var data_type of data_types) {
        console.log(req.body[data_type])
        if (req.body[data_type]) {
            db.get("users")
                .find({email: id_email})
                .set(data_type, req.body[data_type])
                .write()
        }
    }
    res.redirect("/")
})


app.post("/delete_column", (req, res) => {
    const filtered_types = db.get("data_types")
                                .filter((type) => type != req.body.column)
                                .value()
    db.set("data_types", filtered_types)
        .write()
    
    const users = db.get("users")
    let i=0
    for (var user of users) {
        for (var prop in user) {
            if (prop == req.body.column)
            db.unset(`users.${i}.${prop}`).write()
        }
        i +=1
    }
    
    res.redirect("/")
})
app.post("/update_user", (req, res) => {
    const id_email = req.body.id_email
    const data_types = db.get("data_types")
    for (var data_type of data_types) {
        const data = db.get("users")
                        .find({email: id_email})
                        .get(data_type)
                        .value()
        if (!data) {
            console.log(data_type, data)
            console.log("SETTING NEW DATA ")

            db.get("users")
                .find({email: id_email})
                .set(data_type, req.body[data_type])
                .write()
        }
    }
    res.redirect("/")
})

app.post("/delete_user", (req, res) => {
    const id_email = req.body.id_email
    db.get("users")
        .remove({email: id_email})
        .write()
    res.redirect("/")
})

app.post("/add_data_type", (req, res) => {
    const name = req.body.new_type
    
    add_data_type(name)
    
    res.redirect("/")
})

app.post("/add_data", (req, res) => {
    const data_types = db.get("data_types").value()
    let data_object = {}
    for (var data_type of data_types) {
        const data = req.body[data_type]
        data_object[data_type] = data
    }
    add_user(data_object)
    res.redirect("/")
})


const PORT = 8080
app.listen(PORT, () => {
    console.log("stockage started on port => " + PORT)
})