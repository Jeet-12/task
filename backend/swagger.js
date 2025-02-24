const swaggerJsdoc = require("swagger-jsdoc");

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "News API",
      description: "News Feed API",
      version: "1.0.0",
    },
  },
  apis: ["./routes/*.js"],
};

module.exports = swaggerJsdoc(swaggerOptions);
