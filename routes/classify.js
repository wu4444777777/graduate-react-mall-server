var express = require('express');
var router = express.Router();
var db = require('../models/db')

router.get("/classifyList",function(req,res) {
  if(req.query) {
    db.query('select * from content where type=? and sellStatus=1',[req.query.type],function(typeList) {
      res.send({
        data: typeList,
        resultCode: 0,
        resultMsg: "success"
      })
    })
  }
})

router.get("/getAllProduct",function(req,res){
  db.query("select * from content where sellStatus=1",[],function(productList){
    res.send({
      data: productList,
      resultCode: 0,
      resultMsg: "success"
    })
  })
})

router.get("/setsellStatus",function(req,res){
  console.log('status====>',req.query.sellStatus)
  if(req.query.sellStatus == 1){
    db.query('update content set sellStatus=1 where id=?;select * from content',[req.query.id],function(sell){
      if(sell[0].affectedRows == 1){
        res.send({
          data: sell[1],
          resultCode: 0,
          resultMsg: "上架该商品成功"
        })
      }
    })
  }else{
    db.query('update content set sellStatus=0 where id=?;select * from content',[req.query.id],function(sell){
      if(sell[0].affectedRows == 1){
        res.send({
          data: sell[1],
          resultCode: 0,
          resultMsg: "下架该商品成功"
        })
      }
    })
  }
})
module.exports = router;