import * as config from "./index.js";

const swaggerDefinition = {
  info: {
    title: "WEBSTORE API REQUIREMENT",
    version: "1.0.0",
    description: "API FOR INTERNSHIP TRÒN TRÒN",
    contact: {
      name: "Lê Nguyễn Yến Hồng",
      email: "lenguyenyenhong1199@gmail.com",
    },
  },
  servers: ["http://localhost:5000"],
  basePath: "/",
  securityDefinitions: {
    bearerAuth: {
      type: "apiKey",
      name: "x-auth-token",
      scheme: "bearer",
      in: "header",
    },
  },
  security: [{ bearerAuth: [] }],
};

const swaggerOptions = {
  swaggerDefinition,
  apis: ["./src/components/categories/categoryModel.js"],
};

export default swaggerOptions;
