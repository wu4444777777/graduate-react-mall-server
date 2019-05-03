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

// 管理员
router.get('/getUserList',function(req,res){
  user.query('select * from user',[],function(userResult){
    res.send({
      data: userResult,
      resultCode: 0,
      resultMsg: "success"
    })
  })
})

router.get("/AdminSearchUserInfo",function(req,res){
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
    user.query(`select * from user where ${searchStr}`,[],function(searchResult){
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
          resultMsg: "未查询到该用户，请重输"
        })
      }
    })
  }
})

router.get("/getUserAmount",function(req,res){
  console.log("time",req.query.registerDate)
  let addUserPercentage = 0
  if(req.query){
    user.query('select * from user;select * from user where registerDate= ?',[req.query.registerDate],function(userAmount){
      console.log("userAmount",userAmount)
      addUserPercentage = userAmount[1].length / userAmount[0].length 
      console.log("百分比",addUserPercentage)
      res.send({
        data: {
          userAmount: userAmount[1].length,
          addUserPercentage
        },
        resultCode: 0,
        resultMsg: "success"
      })
    })
  }
})

router.post('/adminRegister',function(req,res){
  if(req.body) {
    user.query('insert into adminuser(username,password,phone,email,registerDate,userToken) values(?,?,?,?,?,?)',[req.body.username,req.body.password,req.body.phone,req.body.email,req.body.registerDate,req.body.userToken],function(adminResult){
      if(adminResult.affectedRows == 1){
        res.send({
          resultCode: 1,
          resultMsg: 'success'
        })
      }else{
        res.send({
          resultCode: 0,
          resultMsg: "注册失败"
        })
      }
    })
  }
})

router.get('/adminLogin',function(req,res){
  if(req.query){
    user.query('select * from adminUser where phone=?',[req.query.phone],function(selectRes){
      if(selectRes && selectRes.length >0){
        if(req.query.password == selectRes[0].password) {
          res.send({
            data: selectRes[0],
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
          resultCode: 0,
          resultMsg: "您还未注册"
        })
      }
    })
  }
})
module.exports = router;
