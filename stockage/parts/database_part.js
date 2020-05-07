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