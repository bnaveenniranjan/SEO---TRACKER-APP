import keywordTracking from "../models/keywordTRacking";

// add akeywords to track
export const addkeyword = async(req,res) => {
   try{
    const{keyword,url} = req.body;

  
    if(!keyword || !url) return res.status(400).json({success:false,message:"keyword and URL are required"});
    let domain;
    try{
        const urlObj = new URL(url.startsWith("http")? url:`https://${url}`)
    }catch(error){
          return res.status(400).json({success:false,message:"Invaild URL format"});
    } 
    const existing = await keywordTracking.findOne({userId:req.userId,keyword:keyword.toLowerCase().trim(),domain});

    if(existing){
         return res.status(400).json({success:false,message:"already tracking this keyword for this domain"});
    }
    //CReate tracking entry 
    const tracking = await keywordTracking.create({
        userid: req.userId,
        keyword:keyword.toLowerCase().trim(),
        url:url.startsWith("http") ? url : `https://${url}`,
        domain,
        status:"checking"
    })

    res.status(201).json({success:true,message:"keyword tracking started",tracking});
    
}catch(error){

}
}

//
export const getKeywords = async (req,res) =>{

}
//get single keyword with full history
export const getKeyword = async (req,res)=>{

}
//Manually refresh keyword ranking
export const refreshkeyword = async(req,res) =>{

}
//Delete keyword tracking
export const deleteKeyword = async(req,res) => {

}
//toggle tracking active/inactive
export const toggleTracking = async(req,res) => {

}