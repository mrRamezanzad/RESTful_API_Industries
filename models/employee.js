const mongoose  = require('mongoose'),
      Company   = require('./company'),

     employeeSchema = new mongoose.Schema({
        firstName: {
            type: String,
            // minlength: 3,
            // maxlength: 25,
        },
        lastName: {
            type: String,
            // minlength: 3,
            // maxlength: 25,
            // required: true,
        },
        id: {
            type: String,
            // minlength: 10,
            // maxlength: 10,
            // required: true,
            unique: true,
        },
        gender: {
            type: String,
            enum: ["female", "male"],
            // required: true,
        },
        manager: {
            type: Boolean,
            // required: true,
        },
        birthday: {
            type: Date,
            // required: true,
        },
        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Company",
            required: true,
        },

})

// ============== check hooks for employee model ============== 
employeeSchema.pre('save', function (next) {

    if (this.manager !== true) return next()

    Employee.find({manager: true, company: this.company}, (err, manager) => {

        if (err) return next(err)
        if (manager.length) return next(new Error("this company has a manager already"))
        return next()
    })
})

employeeSchema.pre('updateOne', function (next) {

    if (this._update.manager !== "true") return next()
    
    Employee.findById({_id: this._conditions._id,}, (err, employee) => {
        
        if(err) return next(err)
        Employee.find({company: employee.company, _id: {$ne: employee._id}, manager: true}, (err, manager) => {

            if (err) return next(err)
            if(manager.length) return next(new Error("duplicate item"))
            return next()
            
        })
    })
})

const Employee = mongoose.model("Employee", employeeSchema)
module.exports = Employee