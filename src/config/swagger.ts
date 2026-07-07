import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Expense Tracker API",
    version: "1.0.0",
    description:
      "REST API for tracking expenses, wallets, budgets and categories",
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Local dev server",
    },
  ],
};

const options: swaggerJSDoc.Options = {
  swaggerDefinition,
  apis: ["./src/modules/**/*.router.ts"],
};

export const swaggerSpec = swaggerJSDoc(options);
