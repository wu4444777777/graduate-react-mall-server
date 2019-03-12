var express = require('express');
var router = express.Router();
var db = require('../models/db');

router.post("/insertOrderList",function(req,res) {
  // let count = 0
  if(req.body && req.body.orderList && req.body.orderList.length>0) {
    for(let item of req.body.orderList) {
      let totalPrice = item.num * item.price
      db.query('insert into userorder(id,productName,price,imageUrl,num,totalPrice,username,userphone,userToken,address) values(?,?,?,?,?,?,?,?,?,?)',[
        item.id,item.name,item.price,item.imageUrl,item.num,totalPrice,req.body.username,req.body.userphone,req.body.userToken,req.body.address],function(orderInsert) {
          console.log("orderInsert",orderInsert)
          if(orderInsert.affectedRows == 1) {
            db.query('delete from cartrecord where id=?',[item.id],function(deleteCartResult){
              if(deleteCartResult.affectedRows !=0){
                res.json({
                  data: {},
                  resultCode: 0,
                  resultMsg: "success"
                })
              }
            })
          }
        }
      )
    }
  }
})

router.get("/getOrderList",function(req,res){
  db.query('select * from userorder',[],function(selectOrder){
    res.json({
      data: selectOrder,
      resultCode: 0,
      resultMsg: "success"
    })
  })
})

router.get("/searchOrder",function(req,res){
  if(req.query) {
    // 记得搜索一下有没有模糊搜索数据库的方法
    db.query('select * from userorder where productName=?',[req.query.name],function(searchResult){
      console.log(searchResult)
      if(searchResult && searchResult.length>0) {
        res.send({
          data: searchResult,
          resultCode: 0,
          resultMsg: "success"
        })
      }else{
        res.send({
          data: {},
          resultCode: 1,
          resultMsg: "未查询到该商品，请重输！"
        })
      }
    })
  }
})

module.exports = router;