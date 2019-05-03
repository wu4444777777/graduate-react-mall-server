var express = require('express');
var router = express.Router();
var db = require('../models/db');

/* GET home page. */
router.get('/getData', function(req, res, next) {
  db.query('select * from content where prior=1 and sellStatus=1',[],function(row){
    res.send({
      resultCode: 0,
      resultMsg: "success",
      data: row
    })
  })
});


module.exports = router;
