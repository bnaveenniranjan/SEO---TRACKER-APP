import cron from "node-cron";
import KeywordTracking from "../models/keywordTRacking.js";

export function startRankTrackingCron(){
    cron.schedule(" 0 6 * * *",async(params)=>{
        console.log("Starting daily rank tracking... ");
        try{
          const activeTracking = await KeywordTracking.find({active : true})
          for(const tracking of activeTracking){
            tracking.status = "checking";
            await tracking.save()

            const result = await KeywordTracking.findByIdAndUpdate(tracking._id,{status:"checked"})
            // Delay between checks to avoid rate limiting
            await new Promise((r)=>setTimeout(r,1000 + Math.random()*5000 ))
          }
        }catch(error){
            console.error("[CRON] Rank tracking cron error:",error.message);
        
        }
    })
    console.log("Rank tracking cron job scheduled")
}