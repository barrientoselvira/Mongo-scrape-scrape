var mongoose = require('mongoose');

//Save a reference to the Schema constructor
var Schema = mongoose.Schema;

//UserSchema object
var ArticleSchema = new Schema({
    //title is required and of type String
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    saved: {
        type: Boolean,
        default: false
    },
    note: {
        type: Schema.Types.ObjectId,
        ref: 'Note'
    }
});

var Article = mongoose.model('Article', ArticleSchema);

module.exports = Article; 

