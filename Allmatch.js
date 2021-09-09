let request = require("request");
let cheerio = require("cheerio");
let scoreCardObj = require("./scorecard.js");

console.log("Before3");

function getAllMatchesLink(url){
    request(url, function(error, response, html){
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
        getUrlAllSocrecard(html);
    }
    })
}

function getUrlAllSocrecard(html){
    let searchTool = cheerio.load(html);
    let scorecardLinksArr = searchTool("a[data-hover='Scorecard']");
   
    for(let i=0;i<scorecardLinksArr.length;i++){
        let link = searchTool(scorecardLinksArr[i]).attr("href");
        let fullLink = `https://www.espncricinfo.com${link}`;
        console.log(fullLink);
        scoreCardObj.psm(fullLink);
      
    }

//    console.log(stats);
    // for(let i in stats){
    //     fs.writeFileSync("player.js", stats[i]);
    // }

    
}

console.log("After3");

module.exports = {
    gAlmatches: getAllMatchesLink
}