let request = require("request");
let cheerio = require("cheerio");
const AllMatchobj = require("./Allmatch");
let fs = require("fs");
const path = require("path");
// let scoreCardObj = require("./scorecard.js");
// data extract -> cheerio
let url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595";
console.log("Before");

const iplPath = path.join(__dirname, "ipl");
dirCreator(iplPath);

request(url, cb);
function cb(error, response, html){
    // console.log('error:', error); //Print the error if one occurered
    //
    if(error){
        console.log('error:', error); //Print the error if one occurered
    }
    else if(response.statusCode == 404){
        console.log("Page Not Found");
    }
    else{
       // console.log(html); // Print the HTML for the request
        dataExtracter(html); 
    }
}

function dataExtracter(html){
    // search tool
    let searchTool = cheerio.load(html);
   // selector
    let results = searchTool("a[data-hover='View All Results']");
    let link = results.attr("href");
    // here we get only relative path
    let fullLink = `https://www.espncricinfo.com${link}`;
    AllMatchobj.gAlmatches(fullLink);
}

// function getAllMatchesLink(url){
//     request(url, function(error, response, html){
//     // console.log('error:', error); //Print the error if one occurered
//     //
//     if(error){
//         console.log('error:', error); //Print the error if one occurered
//     }
//     else if(response.statusCode == 404){
//         console.log("Page Not Found");
//     }
//     else{
//        // console.log(html); // Print the HTML for the request
//         getUrlAllSocrecard(html);
//     }
//     })
// }

// function getUrlAllSocrecard(html){
//     let searchTool = cheerio.load(html);
//     let scorecardLinksArr = searchTool("a[data-hover='Scorecard']");
   
//     for(let i=0;i<scorecardLinksArr.length;i++){
//         let link = searchTool(scorecardLinksArr[i]).attr("href");
//         scorecardLinksArr[i] = `https://www.espncricinfo.com${link}`;
//        scoreCardObj.psm(scorecardLinksArr[i]);
//     }

// //    console.log(stats);
//     // for(let i in stats){
//     //     fs.writeFileSync("player.js", stats[i]);
//     // }

    
// }

function dirCreator(filePath){
    if(!fs.existsSync(filePath)){
        fs.mkdirSync(filePath);
    }
}

console.log("After");
