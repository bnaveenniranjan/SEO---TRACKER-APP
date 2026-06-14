import Analysis from "../models/Analysis";
import { scrapeUrl } from "../services/scraperService";

//Analysis a url
export const analyzeUrl  = async(req,res) => {
     try{
        const{url} = req.body;
        if(!url) return res.status(400).json({success:false,message:"URL is required"});
        
        //VaLidate URL format
        let validUrl;
        try{
            validUrl = new URL(url.startWith("http") ? url :`https://${url}`);
        }catch(error){
            return res.status(400).json({success:false,message:"Invaild URL format"});
        }
        // Create analysis record with pending status
        const analysis = await Analysis.create({userId:req.userId,url:validUrl.href,status:"processing"});
    
        // Send immediate response with analyis ID
        res.json({success : true, message:"Analysis Started",analysisId:analysis._id})
        //Run scarping and analysis in background
        try{
            //Step 1:Scrape the URL with BrowserBase
           const scrapeResult = await scrapeUrl(validUrl.href)

           if(!scrapeResult.success){
            analysis.status = "failed";
            await analysis.save();
            return;
           }
           //step 2 : analyze with Gemini Ai
        }catch(bgerror){
         console.error("Background analysis error:",bgerror.message);
         try{
            analysis.status ="failed";
            await analysis.save()
         }catch(saveError){

         }console.error("Failed to save failed status:",saveError.message);
        }
        }catch(error){
            console.error("Analyze URL error:",error.message);
            if(!res.headerSent){
            res.status(500).json({success:false,message:"server error"})

            }

        }
        
     }catch(error){
     
     }


//Get analysis by ID
export const getAnalysis = async(req,res) => {

}
//Get all analyses for user
export const getAnalyses = async(req,res) => {


}
//Deleted  analyses for user
export const deleteAnalysis = async(req,res) => {

    
}