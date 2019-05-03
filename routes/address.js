var express = require('express');
var router = express.Router();
var db = require('../models/db')

router.post("/addORupdateAddress",function(req,res){
  if(req.body){
    if(req.body.prior == 1){
      db.query('update address set prior=0 where userToken=?',[req.body.userToken],function(updataPriorResult){
        console.log("修改",updataPriorResult)
      })
    }
    if(req.body.id != 0){
      console.log("prior====>",req.body.prior)
      db.query('update address set username=?,userphone=?,province=?,city=?,district=?,detailAddress=?,prior=? where id=? and userToken=?',[
        req.body.username,req.body.userphone,req.body.province,req.body.city,req.body.district,req.body.address,req.body.prior,req.body.id,req.body.userToken
      ],function(result){
        res.send({
          data: {},
          resultCode: 0,
          resultMsg: "修改成功"
        })
      })
    }else{
      db.query('insert into address(username,userphone,province,city,district,detailAddress,prior,userToken) values(?,?,?,?,?,?,?,?)',[
        req.body.username,req.body.userphone,req.body.province,req.body.city,req.body.district,req.body.address,req.body.prior,req.body.userToken],function(addressInsertInfo){
          if(addressInsertInfo) {
            res.send({
              data: {},
              resultCode: 0,
              resultMsg: "保存成功"
            })
          }else{
            res.send({
              data: {},
              resultCode: 1,
              resultMsg: "保存失败"
            })
          }
        }
      )
    }
  }
})

router.get("/getAddress",function(req,res){
  if(req.query){
    db.query('select * from address where id=?',[req.query.id],function(selectOneAddressResult){
      res.send({
        data: selectOneAddressResult,
        resultCode: 0,
        resultMsg: "success"
      })
    })
  }
})

router.get("/getAddressList",function(req,res){
  if(req.query){
    db.query('select * from address where userToken=?',[req.query.userToken],function(selectAddressResult){
      res.send({
        data: selectAddressResult,
        resultCode: 0,
        resultMsg: "success"
      })
    })
  }
})

router.get("/deleteAddress",function(req,res){
  if(req.query){
    db.query('delete from address where id=?',[req.query.id],function(deleteAddressResult){
      if(deleteAddressResult.affectedRows == 1){
        db.query('select * from address where userToken=?',[req.query.userToken],function(selectAddressResult){
          res.send({
            data: selectAddressResult,
            resultCode: 0,
            resultMsg: "success"
          })
        })
      }
    })
  }
})

// 获取默认地址，prior=1的情况下
router.get("/getPriorAddress",function(req,res){
  if(req.query){
    db.query('select * from address where prior=1 and userToken=?',[req.query.userToken],function(priorResult){
      if(priorResult && priorResult.length>0){
        res.send({
          data: priorResult[0],
          resultCode: 0,
          resultMsg: "success"
        })
      }else{
        res.send({
          data: {},
          resultCode: 1,
          resultMsg: "您还未添加新地址"
        })
      }
    })
  }
})

// 获取用户订单页地址
router.get("/getUserAddress",function(req,res){
  if(req.query){
    db.query('select * from address where id=?',[req.query.id],function(addressResult){
      if(addressResult){
        res.send({
          data: addressResult,
          resultCode: 0,
          resultMsg: "success"
        })
      }
    })
  }
})
module.exports = router;
