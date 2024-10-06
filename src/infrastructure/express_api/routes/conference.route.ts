import * as express from "express";
import {bookSeat, changeDate, changeSeats, organizeConference} from "../controllers/conference.controllers";
import {isAuthenticated} from "../middlewares/authentication.middleware";
import container from "../../../infrastructure/express_api/config/dependency-injection";

const router = express.Router();

router.use(isAuthenticated)
router.post('/conference', organizeConference(container));
router.patch('/conference/seats/:id', changeSeats(container));
router.patch("/conference/date/:id", changeDate(container))
router.post("/conference/booking", bookSeat(container))

export default router;