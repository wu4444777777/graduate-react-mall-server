var express = require('express');
var router = express.Router();
var db = require('../models/db')

router.get("/searchProduct",function(req,res){
  if(req.query) {
    // 记得搜索一下有没有模糊搜索数据库的方法
    db.query('select * from content where name like ?',["%"+req.query.name],function(searchResult){
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