var express = require('express');
var router = express.Router();
var db = require('../models/db')

/* GET home page. */
router.post('/saveRecord', function(req, res, next) {
  if(req.body != false) {
    db.query('insert IGNORE into saverecord(id,name,price,imageUrl,type) values(?,?,?,?,?)',[
      req.body.id,req.body.name,req.body.price,req.body.image,req.body.type
    ],function(record){
      if(record) {
        if(record.warningCount == 0) {
          res.send({
            resultCode: 0,
            resultMsg: "收藏成功",
            data: {}
          })
        }else{
          res.send({
            resultCode: 1,
            resultMsg: "您已收藏",
            data: {}
          })
        }
      }else{
        res.send({
          resultCode: 1,
          resultMsg: "收藏失败，请重试！",
          data: {}
        })
      }
    })
  }
})


module.exports = router;
