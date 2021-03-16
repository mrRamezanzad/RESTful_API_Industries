const express   = require('express'),
      router    = express.Router(),
      path      = require('path'),
      Company   = require(path.join(__dirname, '../services/company')),
      Employee  = require(path.join(__dirname, '../services/employee'))

// ====================== home page =========================
router.get('/', function (req, res) {return res.render('index')})

// ============================ employee page ============================ 
router.get('/employees/', function (req, res) {
  
  Employee.read({}, {}, (err, employees) => {
    
    if (err) return res.render('employee', {msg: "something went wrong", err})
    return res.render('employee', {employees,})
  })
})

// ========================= company's employees =====================
router.get('/companies/:id/employees/', (req, res) => {
  
  Employee.read({company: req.params.id}, {}, (err, employees) => {
 
    if (err)  return res.render('employee', {msg: "something went wrong"})
    return res.render('employee', {employees,})
  })
})

// ============================= company page =============================
router.get('/companies/', function (req, res) {

  if (req.query.startDate && req.query.endDate){
    
    Company.read({registerDate: {$gt: req.query.startDate, $lt: req.query.endDate}}, {}, (err, companies) => {
      
      if(err) return res.status(500).render('company', {companies: {}})
      return res.render('company', {companies})
      
    })

  } else {
    
    Company.read({}, {_id: 0}, (err, companies) => {
      
      if (err) return res.render('company', {msg: "something went wrong", err})
      return res.render('company', {companies,err})
    })
  }
})
  
// ============================ COMPANY'S THAT ARE REGISTERED DURING SELECTED DATES ===============================
router.get('/compnaies/')

module.exports = router