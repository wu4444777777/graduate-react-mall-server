var express = require('express');
var router = express.Router();
var db = require('../models/db');

/* GET home page. */
router.get('/getData', function(req, res, next) {
  db.query('select * from content where prior=1',[],function(row){
    res.send({
      resultCode: 0,
      resultMsg: "success",
      data: row
    })
  })
});

router.get('/sendDetail',function(req,res) {
  console.log("参数",req)
  console.log("query",req.query)
  if(req.query.id) {
    db.query('select * from content where id=?',[req.query.id],function(result){
      res.send({
        resultCode: 0,
        resultMsg: "success",
        data: result
      })
    })
  }
})

module.exports = router;
