const { Op } = require("sequelize")
const filterObj = (obj, ...allowedFields) => {
  // Iterate over each search parameter and add conditions to the where clause
  // Object.entries return array of every key and value as pair in array return array of arrays
  const whereClause = Object.entries(obj)
    .filter(([param]) => allowedFields.includes(param))
    .map(([param, value]) => {
      if (param === "id") {
        return { [param]: parseInt(value) }
      } else if (param === "openAt") {
        return { [param]: parseInt(value) }
      } else if (param === "serviceTypeId") {
        return { [param]: parseInt(value) }
      } else if (param === "serviceId") {
        return { [param]: parseInt(value) }
      } else {
        return { [param]: { [Op.iLike]: `%${value.replace(/['"]+/g, "")}%` } }
      }
    })

  return whereClause
}
module.exports = filterObj
