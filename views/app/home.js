const express = require("express");
const router = express.Router();
const dbCongif = require('../../config/dbconfig')

//查询用户列表(封装方法)
router.get('/home', (req, res) => {
  // 查列表
  let sql = `select * from app_swiper_table `
  let sqlArr = []
  dbCongif.sqlConnect(`select * from goods_table `,[],(errMsg,data)=>{
    let goodsList = data
    let callBack = (err,results)=>{
      if (err) {
        console.log('连接失败')
      } else {
        let data = {
          swiperList: results,
          goodsList: goodsList,
          success: true,
          message: '加载成功'
        }
        res.send(data)
      }
    }
    dbCongif.sqlConnect(sql,sqlArr,callBack)
  })
})
module.exports = router;