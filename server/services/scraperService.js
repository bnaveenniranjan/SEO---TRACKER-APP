import { chromium } from "playwright-core";
import Browserbase from "@browserbasehq/sdk";


  export async function scrapeUrl (url){
    const bb = new Browserbase({
      apiKey: process.env.BROWSERBASE_API_KEY,
    });
    let browser;
    try{
      const session = await bb.sessions.create({ browserSettings: { blockAds: true } });
          browser = await chromium.connectOverCDP(session.connectUrl);
          const defaultContext = browser.contexts()[0];
          const page =defaultContext.pages()[0];
          page.setDefaultTimeout(30000);

          const startTime = Date.now()
          let response;
          try{
            response = await page.goto(url,{waitUntil:"domcontentloaded"})
           }catch (error){
            await browser.close().catch(()=>{});
            browser = null;
            return {success : false,error: error.message}
          }
          const loadtime = Date.now() - startTime;
          await page.waitForTimeout(2000);

          //Extract all SEO-relevant data from the rendered page
          const scrappedData = await page.evaluate(()=>{
            const getMeta = (name)=>{
                const el = document.querySelector(`meta[name="${name}"]`) || document.querySelector(`meta[property="${name}"]`);
                return el? el.getAttribute("content") || "" : "";

            }
            const title = document.title || "";
            const description = getMeta("description");
            const canonical = document.querySelector('link[rel="canonical"]')?.href || "";
            const robots = getMeta("robots");
            const ogtitle = getMeta("og:title");
            const ogdescription = getMeta("og:description");
            const ogImage = getMeta("og:image");
            const twitterCard = getMeta("twitter:card");
            const viewport = getMeta("viewport");
            const charsetMeta = document.querySelector('meta[charset]');
            const charset = charsetMeta ? charsetMeta.getAttribute("charset")  || " " : ""; 

            const h1elements = document.querySelectorAll("h1");
            const h1Texts = Array.from(h1elements).map((el)=>el.textContent?.trim() || "");
            const heading ={
                h1:document.querySelectorAll("h1").length,
                h2:document.querySelectorAll("h2").length,
                h3:document.querySelectorAll("h3").length,
                h4:document.querySelectorAll("h4").length,
                h5:document.querySelectorAll("h5").length,
                h6:document.querySelectorAll("h6").length,
                h1Texts,


            };
            const allLinks = Array.from(document.querySelectorAll("a[href]"));
            const currentHost = window.location.hostname;
            let internalLinks =0;
            let externalLinks = 0;
            allLinks.forEach((link)=>{
                try{
                    const href = link.href;
                    if(href.startsWith("mailto:")|| href.startsWith("tel:"))return;
                    const linkUrl = new URL(href);
                    if(linkUrl.hostname === currentHost) internalLinks++;
                    else externalLinks++
                }catch(error){
            }
            
          })
          const allImages = Array.from(document.querySelectorAll("img"));
          const missingAlt = allImages.filter((img)=>!img.alt || img.alt.trim() === "").length;

          const bodyText = document.body?.innerText ||  "";
          const wordCount = bodyText.split(/\s+/).filter((w)=>w.length > 0).length;
          const pageSize = document.documentElement.outerHTML.length;
          
          return{
            metadata:{title,description,canonical,robots,ogtitle,ogdescription,ogImage,twitterCard,viewport,charset},
            heading,
            links:{internal : internalLinks,external:externalLinks,total:allLinks.length},
            image:{total:allImages.length,missingAlt,withAlt:allImages.length-missingAlt},
            wordCount,
            pageSize,
            bodyText:bodyText.substring(0,3000),
            }
            
          
         }) 
          
         const statusCode = response?.status() || 0;
         await page.close();
         await browser.close();

         return{
            success:true,
            data:{...scrappedData,loadtime,statusCode,url}
         }


    }catch (error){
        console.error("[SCRAPER] Playwright session failed:",error.message);
        if(browser){
            try{
                await browser.close()

            }catch(error){
                console.error("[SCRAPER] browser close failed:",error.message);
            }
        }

        return {success:false, error:error.message};
    }
  }