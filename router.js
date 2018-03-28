// 0. 加载 express
const express = require('express')
const Joi = require('joi')

// 加载所有的处理函数模块
const index = require('./controllers/index')
const topic = require('./controllers/topic')
const user = require('./controllers/user')

// 1. 调用 express.Router() 创建一个路由实例
const router = express.Router()

// 2. 配置路由规则

// 首页路由
router
  .get('/', index.showIndex)

// 用户路由
router
  .get('/signin', user.showSignin)
  // 当你 POST /signin 的时候，先调用 checkSigninBody 中间件，校验通过才真正的执行 signin 中间件
  .post('/signin', checkSigninBody, user.signin)
  .get('/signup', user.showSignup)
  .post('/signup', user.signup)
  .get('/signout', user.signout)

function checkSigninBody (req, res, next) {
  Joi.validate(req.body, { // 基本数据校验
    email: Joi.string().email(),
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/)
  }, (err, value) => {
    if (err) { // 判断客户端发送的数据是否有错误
      res.send({
        code: 400,
        message: err.details
      })
    } else {
      next()
    }
  })
}

// 话题相关
router
  .get('/topic/create', topic.showCreate)
  .post('/topic/create', topic.create)
  // 这是一个动态的路径标识
  // 什么意思？
  // /topic/:topicId 可以匹配 /topic/*
  // /topic/a
  // /topic/b
  // /topic/c
  // /topic/123
  .get('/topic/:topicId', topic.show)
  .get('/topic/:topicId/edit', topic.showEdit)
  .post('/topic/:topicId/edit', topic.edit)
  .get('/topic/:topicId/delete', topic.delete)

// 3. 导出路由对象
module.exports = router

// 4. 在 app.js 中通过 app.use(路由对象) 挂载使之生效
