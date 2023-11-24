const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema ({
    username: {
        type: String,
        required: true
    },
    password: {
        // used {} because can be string for normal password or object for Google OAuth
        type: String,
        required: true
    },
    logs: []
    /*
    logs: [{
        description: String,
        shortDescription: String,
        category: String,
        subCategory: String,
        requester: String,
        contact: String
    }]
    */
})

const UserModel = mongoose.model("users", UserSchema)
module.exports = UserModel