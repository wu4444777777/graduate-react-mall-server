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

router.post('/addIntoCart',function(req,res,next) {
  if(req.body) {
    db.query('insert IGNORE into cartrecord(id,name,price,imageUrl,num) values(?,?,?,?,?);select * from cartrecord',[
      req.body.id,req.body.name,req.body.price,req.body.image,req.body.proNum
    ],
    function(insertCartInfo) {
      if(insertCartInfo[0] != false) {
        if(insertCartInfo[0].warningCount == 0) {
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
            resultMsg: "该商品已在购物车中"
          })
        }
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
module.exports = router;
