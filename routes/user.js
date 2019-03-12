var express = require('express');
var router = express.Router();
var user = require('../models/db')

router.post('/login',function(req,res) {
  if(req.body && req.body != null && req.body != undefined) {
    let userInfo = req.body
    user.query('select * from user where phone=?',[userInfo.phone],function(loginInfo){
      if(loginInfo != false) {
        if(userInfo.password == loginInfo[0].password) {
          res.send({
            data: loginInfo[0],
            resultCode: 0,
            resultMsg: "登录成功"
          })
        }else{
          res.send({
            data: {},
            resultCode: 1,
            resultMsg: "密码错误"
          })
        }
      }else{
        res.send({
          data: {},
          resultCode: 1,
          resultMsg: "您未注册，请先注册！"
        })
      }
    })
  }
})

router.get('/getUserInfo',function(req,res) {
  if(req.query != false) {
    user.query('select * from user where phone=?',[req.query.phone],function(user) {
      res.send({
        data: user[0],
        resultCode: 0,
        resultMsg: "success"
      })
    })
  }
})

router.post('/register',function(req,res) {
  if(req.body){
    let userInfo = req.body
    user.query('select * from user where phone=?',
      [userInfo.phone],
      function(isUser){
        if(isUser && isUser.length == 1) {
          res.send({
            data: {},
            resultCode: 1,
            resultMsg: "您已注册"
          })
        }else{
          user.query('insert into user(username,password,phone,email,qq,registerDate,userToken) values(?,?,?,?,?,?,?)',
          [userInfo.username,userInfo.password,userInfo.phone,userInfo.email,userInfo.qq,userInfo.registerDate,userInfo.userToken],function(insertInfo) {
            if(insertInfo) {
              res.send({
                data: {},
                resultCode: 0,
                resultMsg: "注册成功"
              })
            }
          })
        }
      }
    )
  }
})

router.post('/updateUserInfo',function(req,res){
  if(req.body){
    user.query(`update user set ${req.body.editName}=? where userToken=?;select * from user where userToken=?`,[req.body.editValue,req.body.userToken,req.body.userToken],function(updateResult){
      console.log("更新结果",updateResult)
      if(updateResult[0].affectedRows == 1){
        res.send({  
          data: updateResult[1][0],
          resultCode: 0,
          resultMsg: "success"
        })
      }else{
        res.send({  
          data: updateResult[1][0],
          resultCode: 1,
          resultMsg: "修改失败"
        })
      }
    })
  }
})

module.exports = router;
