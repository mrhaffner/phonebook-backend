const mongoose = require('mongoose');
// var uniqueValidator = require('mongoose-unique-validator');
const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
    .then(res => {
        console.log('Connected to MongoDB')
    })
    .catch((err) => {
        console.log('error connecting to MongoDb:', err.message);
    })

const listingSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        required: true,
        unique: true
    },
    number: {
        type: Number,
        minlength: 4,
        required: true
    },
})

// listingSchema.plugin(uniqueValidator);

listingSchema.set('toJSON', {
    transform: (document, returnedObj) => {
        returnedObj.id = returnedObj._id.toString(),
        delete returnedObj._id,
        delete returnedObj.__v
    }
})


module.exports = mongoose.model('Listing', listingSchema)