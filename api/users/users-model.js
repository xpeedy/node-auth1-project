const db = require("../../data/connection")


function find() {
    return db("users").select("id","username").orderBy("id")
}

function findById(id) {
    return db("users").where({id}).first()
}

 async function add(user){
    const [id] = await db("users").insert(user,"id")
    return findById(id)
}

function findBy(filter) {
    return db("users").where(filter).orderBy("id")
}

module.exports = {
    find,
    findById,
    add,
    findBy
}