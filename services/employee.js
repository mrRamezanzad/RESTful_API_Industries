let employeeModel = require('../models/employee')

module.exports = {

    // ================ drop the collection ================ 
    dropCollection: (model = employeeModel) => {
        model.remove({}, (err, employees) => {
            if (err) console.log(err)
            return console.log(employees)

        })
    },

    // ============ create new employee ============ 
    create: (employeeInfo, callback) => {

        if (Array.isArray(employeeInfo)) {
            
            employeeInfo.forEach(employee => {

                new employeeModel({

                    firstName: employee.firstName,
                    lastName: employee.lastName,
                    id: employee.id,
                    gender: employee.gender,
                    manager: employee.manager,
                    birthday: employee.birthday,
                    company: employee.company

                }).save((err, employee) => {
                    return callback(err, employee)
                })
            })

            // ========= create new employees ========= 
        } else {
            new employeeModel({

                firstName: employee.firstName,
                lastName: employee.lastName,
                id: employee.id,
                gender: employee.gender,
                manager: employee.manager,
                birthday: employee.birthday,
                company: employee.company

            }).save((err, employee) => {
                return callback(err, employee)
            })
        }
    },

    // ================ read employees ================ 
    read: (match, filter, callback) => {
        filter = {
            ...filter,
            // _id: 0,
            __v: 0
        }

        employeeModel.find(match).populate("company").select(filter).exec(function (err, employees) {
           return callback(err, employees)
        })
    },

    // =============== update one employee =============== 
    updateOne: (match, updateInfo, callback) => {

        employeeModel.updateOne(match, updateInfo, {new: true}, (err, employee) => {
            return callback(err, employee)
        })
    },

    // =============== update all employees =============== 
    update: (match, updateInfo, callback) => {
        employeeModel.findOneAndUpdate(match, updateInfo, {new: true}, (err, employee) => {
            return callback(err, employee)
        })
    },

    // ============= delete employee =============
    delete: (match, callback) => {
        employeeModel.deleteOne(match, (err, employee) => {
            return callback(err, employee);
        })
    }
}