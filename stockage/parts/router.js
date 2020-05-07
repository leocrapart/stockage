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