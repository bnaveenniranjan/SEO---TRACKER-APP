import express from "express";
import auth from "../middleware/auth.js";
import { addkeyword, deleteKeyword, getKeyword, getKeywords, refreshkeyword, toggleTracking } from "../controllers/rankController.js";

const rankRouter = express.Router();

rankRouter.post('/add',auth,addkeyword);
rankRouter.get('/list',auth,getKeywords);
rankRouter.get('/:id',auth,getKeyword);
rankRouter.post('/:id/refresh',auth,refreshkeyword);
rankRouter.put('/:id/toggle',auth,toggleTracking);
rankRouter.delete('/:id',auth,deleteKeyword);

export default rankRouter;