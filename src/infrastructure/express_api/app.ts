import express from "express";
import conferenceRoutes from './routes/conference.route'
import {jsonResponseMiddleware} from "../express_api/middlewares/json-response.middleware";
import {errorHandler} from "../express_api/middlewares/error-handler.middleware";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(jsonResponseMiddleware);

app.use(conferenceRoutes)

app.use(errorHandler);

export default app;