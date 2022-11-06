const { mongoose } = require('mongoose')

function handleError(error) {
    console.log('FIND ME NOW!!!!!! -*--*--*-*-*--*-');
    console.log(error.name);
    if (err instanceof mongoose.Error.ValidationError) {
        return ({ errMsg: "ValidationError: check your ..." })
    } else if (err instanceof mongoose.Error.CastError) {
        return ({ errMsg: "CastError: check your ..." })
    } else {
        return ({ errMsg: err })
    }
}