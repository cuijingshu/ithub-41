const Topic = require('../models/topic')
const moment = require('moment')
const marked = require('marked')

exports.showCreate = (req, res, next) => {
  res.render('topic/create.html')
}

exports.create = (req, res, next) => {
  const body = req.body
  
  body.userId = req.session.user.id // 话题的作者，就是当前登陆用户
  body.createdAt = moment().format('YYYY-MM-DD HH:mm:ss') // 话题的创建时间

  Topic.create(body, (err, results) => {
    if (err) {
      // return res.send({
      //   code: 500,
      //   message: err.message
      // })
      return next(err)
    }
    res.send({
      code: 200,
      message: '创建话题成功了'
    })
  })
}

exports.show = (req, res, next) => {
  // 我们可以通过 req.query 来获取查询字符串中的参数
  // const {id} = req.query
  const {topicId} = req.params
  
  // req.params 用来获取动态的路径参数
  // req.query 用来获取查询字符串 ?xxx
  // console.log('req.params === ', req.params)
  // console.log('req.query === ', req.query)

  Topic.findById(topicId, (err, topic) => {
    if (err) {
      return next(err)
    }

    // 在渲染之前把话题的内容 markdown 格式的字符串转成 html 格式字符串
    topic.content = marked(topic.content)

    res.render('topic/show.html', {
      topic
    })
  })
}

exports.showEdit = (req, res, next) => {
  const {topicId} = req.params
  Topic.findById(topicId, (err, topic) => {
    if (err) {
      return next(err)
    }
    // 如果当前被编辑的话题的作者不属于当前登陆用户，则不呈递编辑的内容
    res.render('topic/edit.html', {
      topic
    })
  })
}

exports.edit = (req, res, next) => {
  const {topicId} = req.params // 要修改的话题 id
  const body = req.body // 要修改的话题内容（title、content）
  Topic.updateById(topicId, body, (err, results) => {
    if (err) {
      return next(err)
    }
    res.send({
      code: 200,
      message: '修改话题成功'
    })
  })
}

exports.delete = (req, res, next) => {
  // 1. 得到要删除的话题 id
  // 2. 执行删除操作
  // 3. 发送响应
  const {topicId} = req.params
  Topic.deleteById(topicId, (err, results) => {
    if (err) {
      return next(err)
    }
    res.send({
      code: 200,
      message: '删除成功'
    })
  })
}
