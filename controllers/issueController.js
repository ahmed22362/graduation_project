const db = require("./../models/index")
const factory = require("./factoryHandler")
const Issue = db.issue

exports.getUserId = (req, res, next) => {
  req.body.userId = req.user ? req.user.id : req.body.userId
  req.query.userId = req.user ? req.user.id : req.query.userId
  next()
}

exports.createIssue = factory.createOne(Issue)
exports.getUserIssues = factory.getAll(Issue, ["userId"])
exports.getIssue = factory.getOne(Issue)
exports.updateIssue = factory.updateOne(Issue)
exports.deleteIssue = factory.deleteOne(Issue)
