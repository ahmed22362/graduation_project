const db = require("./../models/index")
const factory = require("./factoryHandler")
const Issue = db.issue
const ModelIssue = db.modelIssue

exports.getUserId = (req, res, next) => {
  req.body.userId = req.user ? req.user.id : req.body.userId
  req.query.userId = req.user ? req.user.id : req.query.userId
  next()
}

// for normal issue coming from logged user
exports.createIssue = factory.createOne(Issue)
exports.getUserIssues = factory.getAll(Issue)
exports.getIssue = factory.getOne(Issue)
exports.updateIssue = factory.updateOne(Issue)
exports.deleteIssue = factory.deleteOne(Issue)

// for issue coming from AI model
exports.createModelIssue = factory.createOne(ModelIssue)
exports.getModelIssue = factory.getOne(ModelIssue)
exports.getModelIssues = factory.getAll(ModelIssue)
exports.deleteModelIssue = factory.deleteOne(ModelIssue)
exports.updateModelIssue = factory.updateOne(ModelIssue)
