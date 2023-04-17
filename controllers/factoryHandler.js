const AppError = require("../utils/appError")
const catchAsync = require("./../utils/catchAsync")
const filterObj = require("../utils/filterObj")
const jwt = require("jsonwebtoken")

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const body = req.body
    const model = await Model.create(body)
    if (!model) return next(new AppError("can't create model", 400))
    res.status(200).json({ status: "success", data: model })
  })

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const id = req.params.id
    const body = req.body
    const model = await Model.findByPk(id)
    if (!model) return next(new AppError("can't find model with this id", 404))
    const updatedModel = await model.update(body, { returning: true })
    res.status(200).json({ status: "success", data: updatedModel })
  })
exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const model = await Model.findByPk(req.params.id)
    if (!model) return next(new AppError("Can't find model with this id", 404))
    await model.destroy()
    res.status(200).json({ status: "success", data: null })
  })

exports.getOne = (Model, attributes, includeObj) =>
  catchAsync(async (req, res, next) => {
    const model = await Model.findByPk(req.params.id, {
      attributes: attributes,
      include: includeObj,
    })
    if (!model) {
      return next(new AppError("can't find model", 404))
    }
    res.status(200).json({ status: "success", data: model })
  })

exports.getAll = (Model, attributes, AllowedParams, whereObj, includeObj) =>
  catchAsync(async (req, res, next) => {
    // Define empty where object
    const allowedObj = filterObj(req.query, AllowedParams)
    // if the where object is empty it return every thing
    const models = await Model.findAll({
      attributes: attributes,
      where: whereObj || allowedObj,
      include: includeObj,
    })
    if (!models) {
      return next(new AppError("Error During getting models!", 500))
    }
    res.status(200).json({ status: "success", data: models })
  })

exports.updateWhere = (Model, whereObj, includeObj) =>
  catchAsync(async (req, res, next) => {
    const model = await Model.findAll({ where: whereObj, include: includeObj })
    if (!model) return next(new AppError("can't find model with this id", 404))
    const updatedModel = await model.update(body, { returning: true })
    res.status(200).json({ status: "success", data: updatedModel })
  })
