var express = require('express');
var router = express.Router();
var db = require('../models/db')

router.get("/classifyList",function(req,res) {
  if(req.query) {
    db.query('select * from content where type=?',[req.query.type],function(typeList) {
      res.send({
        data: typeList,
        resultCode: 0,
        resultMsg: "success"
      })
    })
  }
})

module.exports = router;