const catchAsync = require("../utils/catchAsync")
const db = require("./../models/index")
const AppError = require("../utils/appError")
const Issue = db.issue

exports.createIssue = catchAsync(async (req, res, next) => {
  const user = req.body.user
  const issue = await Issue.create({
    type: req.body.type,
    details: req.body.details,
    state: req.body.state,
    userId: user ? user.id : req.body.userId,
  })
  if (!issue) return next(new AppError("Can't create issue", 400))
  res.status(200).json({ status: "success", data: issue })
})
