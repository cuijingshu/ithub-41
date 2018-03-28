const Topic = require('../models/topic')

exports.showIndex = (req, res, next) => {
  // 读取话题列表，渲染首页
  Topic.findAll((err, topics) => {
    if (err) {
      return next(err)
    }

    res.render('index.html', {
      // user: req.session.user, // 把会话用户信息传递到模板中，模板就可以使用当前登陆的用户了
      topics
    })
  })
}
