import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerFile from "./swagger_output.json" with { type: "json" };

import ProvinceRouter from "./src/controllers/province-controller.js";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use("/api/province", ProvinceRouter);


app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
    console.log(`Swagger en http://localhost:${port}/api-docs`);
});