const express   = require('express'),
      router    = express.Router()

const { response } = require('express')
// adding employee services
const Employee  = require('../services/employee')

// ============== crud services routes
// Employee.dropCollection()

// Employee.create([{
//     firstName: "sami",
//     lastName: "beigi",
//     id: "1",
//     gender: "male",
//     manager: false,
//     birthday: new Date("2010").toDateString(),
//     company: "6047319e41cf7f2bb42b2790"
// }, {
//     firstName: "mitra",
//     lastName: "vahidee",
//     id: "2",
//     gender: "female",
//     manager: true,
//     birthday: new Date("1995").toDateString(),
//     company: "6047319e41cf7f2bb42b2790"
// }, {
//     firstName: "masood",
//     lastName: "rajabi",
//     id: "3",
//     gender: "male",
//     manager: false,
//     birthday: new Date("1980").toDateString(),
//     company: "6047319e41cf7f2bb42b2793"
// },{
//     firstName: "javad",
//     lastName: "sameni",
//     id: "4",
//     gender: "male",
//     manager: false,
//     birthday: new Date("1980").toDateString(),
//     company: "6047319e41cf7f2bb42b2791"
// },{
//     firstName: "zahra",
//     lastName: "momeni",
//     id: "5",
//     gender: "male",
//     manager: true,
//     birthday: new Date("1980").toDateString(),
//     company: "6047319e41cf7f2bb42b2791"
// },{
//     firstName: "saeed",
//     lastName: "bahmani",
//     id: "6",
//     gender: "male",
//     manager: false,
//     birthday: new Date("1980").toDateString(),
//     company: "6047319e41cf7f2bb42b278f"
// }, ], (err, employees) => {
//     console.log(employees);
// })

// Employee.update({
//     _id: "603e930785955a0a1cb0c8cb"
// }, {
//     lastName: "javeed"
// }), (err, employee) => {
// console.log(employee);
// })
// Employee.delete({
//     _id: "603e930785955a0a1cb0c8cb"
// }, (err, employee) => {
// console.log(employee);
// }))
// Employee.read({
//     _id: "603e9cdaecf5174278badbe7"
// }, (err, employee) => {
// console.log(employee);
// }))

// ================= crud routes =================

// ================= create 
router.post("/api/employees/", (req, res) => {
    let newEmployeeInfo = {
        ...(req.body.firstName) && {firstName: req.body.firstName},
        ...(req.body.lastName) && {lastName: req.body.lastName},
        ...(req.body.id) && {id: req.body.id},
        ...(req.body.gender) && {gender: req.body.gender},
        ...(req.body.manager) && {manager: req.body.manager},
        ...(req.body.birthday) && {birthday: new Date(req.body.birthday)},
        ...(req.body.company) && {company: req.body.company}
    }

    // ========== getting informations functionally ============
    // function getInformations(data) {
    //     let employeeProperties = ["firstName", "lastName", "id", "gender", "manager"]
    //     let fullData = {}
    //     employeeProperties.forEach((property, index) => {

    //             ...(data[property]) && {fulldata[property] : data[property]}

    //     })
    //     console.log(fullData);
    // }
    // getInformations()

    Employee.create([newEmployeeInfo], (err, employee) => {
        if (err) return res.status(500).json({msg: "something went wrong"})
        return res.status(201).json(employee)
    })
})

// ================= read

router.get("/api/employees/", (req, res) => {

    let currentYear = new Date().getFullYear()
    let match = {
        ...(req.query.minAge && !req.query.maxAge) && {
            birthday: {$lte: new Date(`${currentYear - req.query.minAge}`)}},
        ...(req.query.maxAge && !req.query.minAge) && {
            birthday: {$gte: new Date(`${currentYear - req.query.maxAge}`)}},
        ...(req.query.minAge && req.query.maxAge) && {birthday: {
                $lte: new Date(`${currentYear - req.query.minAge}`),
                $gte: new Date(`${currentYear - req.query.maxAge}`)
            }},
        ...(req.query.manager) && {manager: req.query.manager}}

    let exc = req.query.exc && req.query.exc.split(",")
    let filter = exc && {
                ...(exc.includes("firstName") && {
                    firstName: 0
                }),
                ...(exc.includes("lastName")) && {
                    lastName: 0
                },
                ...(exc.includes("id")) && {
                    id: 0
                },
                ...(exc.includes("gender")) && {
                    gender: 0
                },
                ...(exc.includes("manager")) && {
                    manager: 0
                },
                ...(exc.includes("birthday")) && {
                    birthday: 0
                }
            }

    if (req.query.company) {

        Company.read({name: `${req.query.company}`}, {}, (err, targetCompany) => {

            if (err) return res.status(500).json({msg: "something went wrong"})

            if (!targetCompany) return res.status(404).json({msg: "found nothing"})

            Employee.read({company: targetCompany[0]._id}, filter, (err, employees) => {
                if (err) return res.status(500).json({msg: "something went wrong"})
                return res.json(employees)
            })
        })
    }

    else {
        Employee.read(match, filter, (err, employees) => {

            if (err) return res.status(500).json({msg: "something went wrong in getting all employees"})
            return res.json(employees)
        })
    }
})

router.get("/api/employees/:id", (req, res) => {

    let currentYear = new Date().getFullYear()
    let  match = {
            ...(req.params.id) && {_id: req.params.id},
            ...(req.query.minAge && !req.query.maxAge) && {
                birthday: {$lte: new Date(`${currentYear - req.query.minAge}`)}},
            ...(req.query.maxAge && !req.query.minAge) && {
                birthday: {$gte: new Date(`${currentYear - req.query.maxAge}`)}},
            ...(req.query.minAge && req.query.maxAge) && {
                birthday: {
                    $lte: new Date(`${currentYear - req.query.minAge}`),
                    $gte: new Date(`${currentYear - req.query.maxAge}`)
                }},
            ...(req.query.manager) && {manager: req.query.manager}
        }
       let exc = req.query.exc && req.query.exc.split(",")
       let filter = exc && {
            ...(exc.includes("firstName") && {firstName: 0}),
            ...(exc.includes("lastName")) && {lastName: 0},
            ...(exc.includes("id")) && {id: 0},
            ...(exc.includes("gender")) && {gender: 0},
            ...(exc.includes("manager")) && {manager: 0},
            ...(exc.includes("birthday")) && {birthday: 0}
        }

    if (req.query.company) {

        Company.read({name: req.query.company}, {}, (err, company) => {
            match = {...match,company: company[0]._id}

            Employee.read(match, filter, (err, employee) => {
                if (err) return res.status(500).json({msg: "something went wrong"})
                return res.json(employee)
            })
        })

    } else {

        Employee.read(match, filter, (err, employee) => {

            if (err) return res.status(500).json({msg: "something went wrong"})
            return res.json(employee)
        })
    }
})

// ================= update one
router.put("/api/employees/:id", (req, res) => {

    let employeeUpdateInfo = {
        ...(req.body.firstName) && {firstName: req.body.firstName},
        ...(req.body.lastName) && {lastName: req.body.lastName},
        ...(req.body.id) && {id: req.body.id},
        ...(req.body.gender) && {gender: req.body.gender},
        ...(req.body.manager) && {manager: req.body.manager},
        ...(req.body.birthday) && {birthday: new Date(req.body.birthday)},
        ...(req.body.company) && {company: req.body.company}
    }

    Employee.updateOne({_id: req.params.id}, employeeUpdateInfo, (err, employee) => {
        if (err) return res.status(500).json({msg: "something went wrong"})
        return res.json(employee);
        
    })
})

// ================= update all
router.put("/api/employees/", (req, res) => {

    let employeeUpdateInfo = {
        ...(req.body.firstName) && {firstName: req.body.firstName},
        ...(req.body.lastName) && {lastName: req.body.lastName},
        ...(req.body.id) && {id: req.body.id},
        ...(req.body.gender) && {gender: req.body.gender},
        ...(req.body.manager) && {manager: req.body.manager},
        ...(req.body.birthday) && {birthday: new Date(req.body.birthday)},
        ...(req.body.company) && {company: req.body.company}
    }

    Employee.update({_id: req.params.id}, employeeUpdateInfo, (err, employee) => {

        if (err) return res.status(500).json({msg: "something went wrong"})
        return res.json(employee)
    })
})

// =================== delete
router.delete("/api/employees/:id", (req, res) => {

    Employee.delete({_id: req.params.id}, (err, response) => {

        if (err) return res.status(500).json({msg: "something went wrong"})
        return res.json(response)
        
    })
})

module.exports = router