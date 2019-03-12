var express = require('express');
var router = express.Router();
var db = require('../models/db')

router.get('/getCartList',function(req,res,next) {
  db.query('select * from cartrecord',[],function(cartResult) {
    if(cartResult && cartResult.length >0) {
      res.send({
        data: cartResult,
        resultCode: 0,
        resultMsg: "success"
      })
    }else{
      res.send({
        data: {},
        resultCode: 1,
        resultMsg: "购物车为空，请去选购"
      })
    }
  })  
})

router.get('/deleteOne',function(req,res,next) {
  if(req.query) {
    db.query('delete from cartrecord where id=?;select * from cartrecord',[req.query.id],function(deleteInfo) {
      if(deleteInfo[0].affectedRows == 1) {
        res.send({
          data: deleteInfo[1],
          resultCode: 0,
          resultMsg: "success"
        })
      }
    })
  }
})

router.get('/deleteLots',function(req,res){
  console.log(req.query)
  if(req.query) {
    db.query('delete from cartrecord where cartId in (?)',[req.query.deleteArr],function(deleteResult){
      console.log(deleteResult)
      if(deleteResult.affectedRows != 0) {
        db.query('select * from cartrecord',[],function(cartList){
          res.send({
            data: cartList,
            resultCode: 0,
            resultMsg: "success"
          })
        })
      }else{
        res.send({
          data: {},
          resultCode: 1,
          resultMsg: "删除失败，请重试！"
        })
      }
    })
  }
})

router.post('/addIntoCart',function(req,res,next) {
  if(req.body) {
    db.query('select * from cartrecord where id=?;select * from cartrecord',[req.body.id],function(selectResult){
      console.log("selectResult",selectResult)
      if(selectResult[0].length >0) {
        res.send({
          data: {
            cartNum: selectResult[1].length
          },
          resultCode: 1,
          resultMsg: "该商品已在购物车中"
        })
      }else{
        db.query('insert into cartrecord(id,name,price,imageUrl,num) values(?,?,?,?,?);select * from cartrecord',[
          req.body.id,req.body.name,req.body.price,req.body.imageUrl,req.body.proNum
        ],
        function(insertCartInfo) {
          console.log("插入数据",insertCartInfo)
          if(insertCartInfo[0]){
            res.send({
              data: {
                cartNum: insertCartInfo[1].length
              },
              resultCode: 0,
              resultMsg: "success"
            })
          }else{
            res.send({
              data: {
                cartNum: insertCartInfo[1].length
              },
              resultCode: 1,
              resultMsg: "加入购物车失败"
            })
          }
        })
      }
    })
  }
})
module.exports = router;
