// ================ importing required models ================
let companyModel = require('../models/company')
let employeeModel = require('../models/employee')

module.exports = {

    // ================ drop collection ================ 
    dropCollection: (model = companyModel) => {
        model.remove({}, (err, companies) => {
            if (err) return console.log(err)
            return console.log(companies)
        })
    },

    // ================ create company ================ 
    create: (companyInfo, callback) => {
        if (Array.isArray(companyInfo)) {

            // ================ create multiple companies ================ 
            companyInfo.forEach(company => {
                
                new companyModel({
                    name: company.name,
                    cin: company.cin,
                    city: company.city,
                    province: company.province,
                    registerDate: company.registerDate,
                    telephone: company.telephone
                    
                }).save((err, company) => {
                    return callback(err, company);
                })
            })
        } else {

            // ================ create one company ================ 
            return new companyModel({
                name: companyInfo.name,
                cin: companyInfo.cin,
                city: companyInfo.city,
                province: companyInfo.province,
                registerDate: companyInfo.registerDate,
                telephone: companyInfo.telephone,

            }).save((err, company) => {
                return callback(err, company);
            })
        }
    },

    // ================ read multiple companies ================ 
    read: (match, filter, callback) => {
        filter = {...filter,_id: 1,__v: 0}

        companyModel.find(match, filter, (err, companies) => {
            return callback(err, companies);
        })
    },

    // ================ read one company ================ 
    readOne: (match, filter, callback) => {
        filter = {...filter,_id: 1,__v: 0}
        
        companyModel.findOne(match, filter, (err, companies) => {
            return callback(err, companies);
        })
    },

    // ================ read specefic company's employees ================ 
    readEmployees: (match, filter, callback) => {
        filter = {...filter,_id: 1,__v: 0}

        companyModel.findOne(match, filter, (err, company) => {

            if (!company) return callback({msg: "nothing found"}, [])

            employeeModel.find({company: company._id}).populate('company').exec((err, employees) => {
                return callback(err, employees)
            })
        })
    },

    // ================ read specefic company's manager ================ 
    readManager: (match, filter, callback) => {
        filter = {...filter,_id: 1,__v: 0}

        companyModel.findOne(match, filter, (err, company) => {

            if(!company) return callback({msg: "nothing found"}, [])

            employeeModel.find({company: company._id, manager: true}).populate('company').exec((err, employees) => {
                return callback(err, employees)
            })
        }) 
    },

    // ================ FIND LIST OF COMPANIES AND IT'S MANAGERS ================ 
    companyManagerList: (match, filter, callback) => {
        match  = {...match, manager:true}
        filter = {...filter, firstName:1, lastName:1, _id: 0, company:1}
        
        employeeModel.find(match, filter).populate('company', 'name -_id').exec((err, employees) => {
            return callback(err, employees)
        }) 
    },

    // ================ update one company ================ 
    update: (match, updateInfo, callback) => {
        companyModel.findOneAndUpdate(
            match, updateInfo, {new: true}, (err, company) => {return callback(err, company)})
    },

    // ================ update all companies ================ 
    updateAll: (match, updateInfo, callback) => {
        companyModel.updateMany(match, updateInfo, {new: true}, (err, companies) => {
            return callback(err, companies);
        })
    },

    // ================ delete ================ 
    delete: (match, callback) => {
        companyModel.deleteOne(match, (err, company) => {
            return callback(err, company);
        })
    }
}