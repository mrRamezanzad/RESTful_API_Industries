const mongoose = require('mongoose');
const Employee = require('./employee');

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    cin: {
        type: String,
        unique: true,
        required: true
    },
    city: {
        type: String,
    },
    province: {
        type: String,
    },
    registerDate: {
        type: Date,
        required: true
    },
    telephone: {
        type: String,

    }
})

// ================= adding neccesary hooks for deletion ===============
companySchema.post('deleteOne', function (doc, next) {
    console.log("====================im here post company deletion====================\n");
    console.log("it is this ================>>", this._conditions._id);
    Employee.remove({
        company: this._conditions._id
    }, (err) => {

        // console.log("starting to remove employees of this company");
        if (err) {

            console.log(err);
            return next(new Erro("there was an error during deletion of employees"))
            
        } else {

            return next()
        }
    })
})

const Company = mongoose.model("Company", companySchema)
module.exports = Company