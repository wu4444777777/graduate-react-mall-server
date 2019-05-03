var express = require('express');
var router = express.Router();
var db = require('../models/db');

router.post("/addActivityInfo",function(req,res){
  if(req.body){
    db.query('insert into activity(activityName,beginTime,endTime,advertise,imageUrl) values (?,?,?,?,?)',[req.body.activityName,req.body.beginTime,req.body.endTime,req.body.advertise,req.body.imageSrc],function(result){
      if(result.affectedRows == 1){
        db.query('select * from activity',[],function(selectResult){
          res.send({
            data: selectResult,
            resultCode: 0,
            resultMsg: "success"
          })
        })
      }else{
        res.send({
          data: {},
          resultCode: 1,
          resultMsg: "新增失败"
        })
      }
    })
  }
})

router.get("/getActivityList",function(req,res){
  if(req.query){
    db.query("select * from activity",[],function(result){
      res.send({
        data: result,
        resultCode: 0,
        resultMsg: "success"
      })
    })
  }
})

router.post('/handlePicLoader',function(req,res){
  if(req.body){
    res.send({
      data: req.body,
      resultCode: 0,
      resultMsg: "success"
    })
  }
})

router.get('/adminSearchActivityInfo',function(req,res){
  if(req.query){
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
      db.query(`select * from activity where ${searchStr}`,[],function(searchResult){
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
            resultMsg: "未查询到该活动，请重输"
          })
        }
      })
    }
  }
})
module.exports = router;