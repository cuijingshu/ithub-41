exports.showCreate = (req, res) => {
  res.render('topic/create.html')
}

exports.create = (req, res) => {
  res.send('create')
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
