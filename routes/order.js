var express = require('express');
var router = express.Router();
var db = require('../models/db');

router.post("/insertOrderList",function(req,res) {
  console.log("查询数据",req.body.orderList)
  if(req.body && req.body.orderList && req.body.orderList.length>0) {
    db.query('insert into userorder(id,productName,price,imageUrl,num,totalPrice,styles,userToken,username,userphone,address,confirmTime) values ?',[req.body.orderList],function(insert){
      console.log("插入新数据",insert)
      if(insert.affectedRows>0){
        db.query('delete from cartrecord where cartId in (?)',[req.body.cartId],function(det){
          console.log("删除数据",det)
          if(det){
            db.query('select stock from content where id in (?)',[req.body.productId],function(select){
              let sqlStr = ''
              for(let item in select){
                sqlStr += `update content set stock=${select[item].stock - req.body.cartNum[item]} where id="${req.body.productId[item]}";`
              }
              if(select && select.length >0){
                db.query(sqlStr,[],function(update){
                  console.log("更新结果",update)
                  if((update && update.length>0) || update.affectedRows > 0){
                    res.send({
                      resultCode: 0,
                      resultMsg: "success"
                    })
                  }else{
                    res.send({
                      resultCode: 1,
                      resultMsg: "更新订单状态失败！"
                    })
                  }
                })
              }else{
                res.send({
                  resultCode: 1,
                  resultMsg: "未查询到该商品"
                })
              }
            })
          }else{
            res.send({
              resultCode: 1,
              resultMsg: "删除失败"
            })
          }
        })
      }else{
        res.send({
          resultCode: 1,
          resultMsg: "添加至订单失败"
        })
      }
    })
  }
})

router.get("/getOrderList",function(req,res){
  if(req.query){
    db.query('select * from userorder where userToken=? and orderStatus=?',[req.query.userToken,req.query.orderStatus],function(selectOrder){
      res.json({
        data: selectOrder,
        resultCode: 0,
        resultMsg: "success"
      })
    })
  }else{
    res.json({
      data: {},
      resultCode: 1,
      resultMsg: "失败"
    })
  }
})

router.get("/searchOrder",function(req,res){
  if(req.query) {
    // 记得搜索一下有没有模糊搜索数据库的方法
    db.query('select * from userorder where productName=?',[req.query.name],function(searchResult){ 
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

router.get("/adminSearchOrderInfo",function(req,res){
  let searchArr = []
  let searchStr = ''
  Object.keys(req.query).map((item,index) => {
    searchArr.push({
      [item]: Object.values(req.query)[index]
    })
  })
  searchArr.map((item,i) => {
    if(i == searchArr.length -1){
      searchStr += `${Object.keys(item)} like "%${Object.values(item)}%"`
    }else{
      searchStr += `${Object.keys(item)} like "%${Object.values(item)}%" and `
    }
  })
  if(req.query){
    db.query(`select * from userorder where ${searchStr}`,[],function(searchResult){
      if(searchResult && searchResult.length >0){
        res.send({
          data: searchResult,
          resultCode: 0,
          resultMsg: "success"
        })
      }else{
        res.send({
          data: {},
          resultCode: 1,
          resultMsg: "未查询到该订单，请重输"
        })
      }
    })
  }
})

router.get("/getOrderAmount",function(req,res){
  let totalPrice = 0
  let orderPercentage = 0
  if(req.query){
    db.query('select * from userorder;select * from userorder where confirmTime like ?',["%"+req.query.confirmTime+"%"],function(confirmResult){
      for(let item of confirmResult[1]){
        totalPrice += item.num * item.price
      }
      orderPercentage = confirmResult[1].length / confirmResult[0].length
      res.send({
        data: {
          orderAmount: confirmResult[1].length,
          totalPrice,
          orderPercentage
        },
        resultCode: 0,
        resultMsg: "success"
      })
    })
  }
})

router.post("/setOrderStatus",function(req,res){
  let sqlStr = ''
  if(req.body){
    for(let item of req.body.orderList){
      sqlStr += `update userorder set orderStatus=${req.body.orderStatus} where id="${item}" and userToken="${req.body.userToken}" and confirmTime="${req.body.confirmTime}";`
    }
    db.query(sqlStr,[],function(result){
      console.log("查询结果=====>",result)
      if((result && result.length > 0) || result.affectedRows > 0){
        res.send({
          data: {},
          resultCode: 0,
          resultMsg: "success"
        })
      }else{
        res.send({
          resultCode: 1,
          resultMsg: "更新订单状态失败"
        })
      }
    })
  }
})

router.get("/adminGetOrderList",function(req,res){
  if(req.query){
    db.query('select * from userorder',[req.query.userToken],function(result){
      if(result && result.length>0){
        res.send({
          data: result,
          resultCode: 0,
          resultMsg: "success"
        })
      }
    })
  }else{
    res.send({
      resultCode: 1,
      resultMsg: "请求参数错误"
    })
  }
})
module.exports = router;