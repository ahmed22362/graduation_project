const swaggerJSDoc = require("swagger-jsdoc")
const swaggerUi = require("swagger-ui-express")
const YAML = require("yamljs")
const path = require("path")


const swaggerDefinition = YAML.load(path.join(__dirname,"./swaggerDoc.yaml"))

const options = {
  swaggerDefinition,
  apis: ["./routes/*.js"],
}

const swaggerSpec = swaggerJSDoc(options)

module.exports = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))
}