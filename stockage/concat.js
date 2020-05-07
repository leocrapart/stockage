const concat = require("concat")

const file1 = "./parts/init.js"
const file2 = "./parts/database_part.js"
const file3 = "./parts/router.js"

const files_to_concat = [file1, file2, file3]
const output_file = "main.js"

concat(files_to_concat,output_file)