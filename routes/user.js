var express = require('express');
var router = express.Router();
var user = require('../models/db')

router.post('/login',function(req,res) {
  if(req.body && req.body != null && req.body != undefined) {
    let userInfo = req.body
    user.query('select * from user where phone=?',[userInfo.phone],function(loginInfo){
      console.log("登录信息",userInfo)
      console.log("浏览器信息",loginInfo)
      if(loginInfo != false) {
        if(userInfo.password == loginInfo[0].password) {
          console.log("1")
          res.send({
            data: loginInfo[0],
            resultCode: 0,
            resultMsg: "登录成功"
          })
        }else{
          console.log("2")
          res.send({
            data: {},
            resultCode: 1,
            resultMsg: "密码错误"
          })
        }
      }else{
        console.log("3")
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
      console.log("user",user)
      res.send({
        data: user[0],
        resultCode: 0,
        resultMsg: "success"
      })
    })
  }
})

router.post('/register',function(req,res) {
  if(req.body != null && req.body != undefined){
    let user = req.body
    user.query('select * from user where phone=?',
      [user.phone],
      function(isUser){
        if(isUser && isUser.length == 1) {
          res.send({
            data: {},
            resultCode: 1,
            resultMsg: "您已注册"
          })
        }else{
          user.query('insert into user(username,password,phone,email,qq) values(?,?,?,?,?)',
          [user.username,user.password,user.phone,user.email,user.qq],function(insertInfo) {
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

module.exports = router;
