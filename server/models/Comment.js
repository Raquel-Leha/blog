const {Schema, model} = require('mongoose')

const commmentSchema = new Schema({
    comment:{
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    postId: {
        type: String,
        required: true,
    },

},
{
    timestamps: true,
})

module.exports = model("Comment", commmentSchema);