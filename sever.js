const express = require('express')
const app = express()
const port = 3001
const fs = require('fs')
const cors = require('cors')
app.use(cors())


app.get('/home/multidata', (req, res) => {
  let f = fs.readFile("./data/home/home_data.json", "utf-8", function (err, data) {
    let j = JSON.parse(data);
    // console.log(data);
    res.json(j)
    // console.log(j);
  })
})

app.get('/home/data', (req, res) => {
  params = req.query
  type = params[Object.keys(params)[0]]
  page = params[Object.keys(params)[1]]

  let f = fs.readFile(`./data/${type}/${type}_page${page}.json`, "utf-8", function (err, data) {
    if (err) {
      res.json(err)
    } else {
      let j = JSON.parse(data);
      res.json(j)
    }
  })
})

app.get('/category/multidata', (req, res) => {
  let f = fs.readFile("./data/category/category_data.json", "utf-8", function (err, data) {
    let j = JSON.parse(data);
    // console.log(data);
    res.json(j)
    // console.log(j);
  })
})

app.get('/category/data', (req, res) => {
  params = req.query
  cate = params[Object.keys(params)[0]]
  type = params[Object.keys(params)[1]]
  page = params[Object.keys(params)[2]]

  let f = fs.readFile(`./data/category/${cate}/${type}/${type}_page${page}.json`, "utf-8", function (err, data) {
    if (err) {
      res.json(err)
    } else {
      let j = JSON.parse(data);
      res.json(j)
    }
  })
})

app.get('/detail', (req, res) => {
  params = req.query
  iid = params[Object.keys(params)[0]]


  let f = fs.readFile(`./data/detail/${iid}.json`, "utf-8", function (err, data) {
    if (err) {
      res.json(err)
    } else {
      let j = JSON.parse(data);
      // console.log(data);
      res.json(j)
      // console.log(j);
    }
  })
})

app.get('/recommend', (req, res) => {
  let f = fs.readFile("./data/detail/recommend.json", "utf-8", function (err, data) {
    let j = JSON.parse(data);
    res.json(j)
  })
})

app.listen(port, () => console.log(`Example app listening on port 3001!`))