import  KeywordTracking  from "../models/keywordTRacking.js";
import { keywordTracking} from "../services/KeywordTrackingService.js";

// add akeywords to track
export const addkeyword = async(req,res) => {
   try{
    const{keyword,url} = req.body;

  
    if(!keyword || !url) return res.status(400).json({success:false,message:"keyword and URL are required"});
    let domain;
    try{
        const urlObj = new URL(url.startsWith("http")? url:`https://${url}`)
        domain = urlObj.hostname.replace("www.","").toLowerCase();
    }catch(error){
          return res.status(400).json({success:false,message:"Invaild URL format"});
    } 
    //check if already tracking this keyword+domain
    const existing = await KeywordTracking.findOne({userId:req.userId,keyword:keyword.toLowerCase().trim(),domain});

    if(existing){
         return res.status(400).json({success:false,message:"already tracking this keyword for this domain"});
    }
    //CReate tracking entry 
    const tracking = await KeywordTracking.create({
        userId: req.userId,
        keyword:keyword.toLowerCase().trim(),
        url:url.startsWith("http") ? url : `https://${url}`,
        domain,
        status:"checking"
    })

    res.status(201).json({success:true,message:"keyword tracking started",tracking});
    keywordTracking(tracking)  

}catch(error){
     console.error("Add Keyword error:",error.message);
     if(error.code === 11000) return res.status(400).json({success:false,message:"already tracking this keyword"});
    res.status(500).json({success:false,message:"Server error"});     
}
}

// get all tracked keywords for user 
export const getKeywords = async (req,res) =>{
    try{
        const keywords = await KeywordTracking.find({userId:req.userId}).sort({createdAt:-1}).select("-rankHistory")
        res.json({success : true, keywords});
    }catch(error){
        console.error("Get Keywords error;",error.message);
        res.status(500).json({success:false,message:"Server error"});

    }
}
//get single keyword with full history
export const getKeyword = async (req,res)=>{
    try{
        const tracking = await KeywordTracking.findOne({_id: req.params.id, userId : req.userId});
        if(!tracking) return res.status(404).json({success:false,message:"keyword tracking not found"});
        tracking.status = "checking";
        await tracking.save();
        res.json({success:true,message:"rank check started"});
        keywordTracking(tracking)
    }catch(error){
        console.log("get Keywords error:",error.message);
        res.status(500).json({success:false,message:"server error"});

    }

}
//Manually refresh keyword ranking
export const refreshkeyword = async(req,res) =>{
    try{
        const tracking = await KeywordTracking.findOne({_id: req.params.id, userId : req.userId});
        if(!tracking) return res.status(404).json({success:false,message:"keyword tracking not found"});
        tracking.status = "checking";
        await tracking.save();
        res.json({success:true,message:"rank check started"});
        keywordTracking(tracking)
    }catch(error){
        console.log("get Keywords error:",error.message);
        res.status(500).json({success:false,message:"server error"});

    }

}
//Delete keyword tracking
export const deleteKeyword = async(req,res) => {
    try{
        const tracking = await KeywordTracking.findOneAndDelete({_id: req.params.id, userId : req.userId});
        if(!tracking) return res.status(404).json({success:false,message:"keyword tracking not found"});
        res.json({success:true,message:"keyword tracking deleted"});
       
    }catch(error){
        console.error("get Keywords error:",error.message);
        res.status(500).json({success:false,message:"server error"});

    }
}
//toggle tracking active/inactive
export const toggleTracking = async(req,res) => {
   try{
        const tracking = await KeywordTracking.findOne({_id: req.params.id, userId : req.userId});
        if(!tracking) return res.status(404).json({success:false,message:"keyword tracking not found"});

        tracking.active = !tracking.active;
        await tracking.save();
        res.json({success:true, tracking });
       
    }catch(error){
        console.error("Toggle tracking error:",error.message);
        res.status(500).json({success:false,message:"server error"});

    }
}