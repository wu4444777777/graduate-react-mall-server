var express = require('express');
var router = express.Router();
var db = require('../models/db');

router.get('/getDetail',function(req,res) {
  console.log("query",req.query)
  db.query('select * from cartrecord where userToken=?',[req.query.userToken],function(cartNum) {
    if(req.query.id) {
      db.query('select * from content where id=?',[req.query.id],function(result){
        res.send({
          resultCode: 0,
          resultMsg: "success",
          data: {
            ...result[0],
            cartNum: cartNum.length
          }
        })
      })
    }
  })
})

module.exports = router;  