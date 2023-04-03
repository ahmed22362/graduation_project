const { Op } = require("sequelize")
const filterObj = (obj, ...allowedFields) => {
  // Iterate over each search parameter and add conditions to the where clause
  // Object.entries return array of every key and value as pair in array return array of arrays
  // The flat() method creates a new array with all sub-array elements concatenated into it
  // recursively up to the specified depth. infinity depth is like say there are no subarray in it

  allowedFields = allowedFields.flat(Infinity)
  const whereClause = Object.entries(obj)
    .filter(([param]) => allowedFields.includes(param))
    .map(([param, value]) => {
      if (param === "id") {
        return { [param]: parseInt(value) }
      } else if (param === "openAt") {
        return { [param]: parseInt(value) }
      } else if (param === "shopType") {
        return { [param]: value }
      } else {
        return { [param]: { [Op.iLike]: `%${value.replace(/['"]+/g, "")}%` } }
      }
    })

  return whereClause
}
module.exports = filterObj
