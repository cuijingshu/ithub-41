const Topic = require('../models/topic')
const moment = require('moment')

exports.showCreate = (req, res) => {
  res.render('topic/create.html')
}

exports.create = (req, res) => {
  const body = req.body
  
  body.userId = req.session.user.id // 话题的作者，就是当前登陆用户
  body.createdAt = moment().format('YYYY-MM-DD HH:mm:ss') // 话题的创建时间

  Topic.create(body, (err, results) => {
    if (err) {
      return res.send({
        code: 500,
        message: err.message
      })
    }
    res.send({
      code: 200,
      message: '创建话题成功了'
    })
  })
}

exports.show = (req, res) => {
  res.send('show')
}

exports.showEdit = (req, res) => {
  res.send('showEdit')
}

exports.edit = (req, res) => {
  res.send('edit')
}

exports.delete = (req, res) => {
  res.send('delete')
}
