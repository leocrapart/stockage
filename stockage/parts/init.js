
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


