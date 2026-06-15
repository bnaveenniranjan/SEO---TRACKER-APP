import express from "express";
import auth from "../middleware/auth.js";
import { analyzeUrl, deleteAnalysis, getAnalyses, getAnalysis } from "../controllers/analysisController.js";

const analysisRouter = express.Router()

analysisRouter.post('/analyze',auth,analyzeUrl);
analysisRouter.get('/list',auth,getAnalyses);
analysisRouter.get('/analyze',auth,getAnalysis);
analysisRouter.delete('/analyze',auth,deleteAnalysis);

export default analysisRouter;
