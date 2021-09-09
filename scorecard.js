let request = require("request");
let cheerio = require("cheerio");
let path = require("path");
let fs = require("fs");
const xlsx = require("xlsx");
const { serialize } = require("cheerio/lib/api/forms");
// data extract -> cheerio
//let url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595/delhi-capitals-vs-mumbai-indians-final-1237181/full-scorecard";
console.log("Before2");

function processSingleMatch(url){
  request(url, cb);
}
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
   let descElem = searchTool(".event .description"); 
   let result = searchTool(".event .status-text");
   let stringArr = descElem.text().split(",");
    let venue = stringArr[1].trim();
    let date = stringArr[2].trim();
    result = result.text();
    let bothInningsArr = searchTool(".Collapsible");
    let content = "";
  //  let json = {};

    for(let i=0;i<bothInningsArr.length;i++){
        //scoreCard = searchTool(bothInningsArr[i]).html();
        let teamNameElem = searchTool(bothInningsArr[i]).find("h5");
        let teamName = teamNameElem.text();
        teamName = teamName.split("INNINGS")[0];
        teamName = teamName.trim();
        let opponentIndex = i==0?1:0;
        let opponentName =  searchTool(bothInningsArr[opponentIndex]).find("h5").text();
        opponentName = opponentName.split("INNINGS")[0].trim();
        
       // console.log(teamName);
        let batsManTableBodyAllRows = searchTool(bothInningsArr[i]).find(".table.batsman tbody tr");
       
        content += teamName;

        for(let j=0;j<batsManTableBodyAllRows.length;j++){
            let numberOfTds = searchTool(batsManTableBodyAllRows[j]).find("td");
            let isWorthy = searchTool(numberOfTds[0]).hasClass("batsman-cell");
            if(isWorthy){
                let playerName = searchTool(numberOfTds[0]).text().trim();
                let runs =  searchTool(numberOfTds[2]).text().trim();
                let balls = searchTool(numberOfTds[3]).text().trim();
                let fours =  searchTool(numberOfTds[5]).text().trim();
                let sixes =  searchTool(numberOfTds[6]).text().trim();
                let sr =  searchTool(numberOfTds[7]).text().trim();
                console.log(`${teamName}, ${playerName}, ${runs}, ${balls}, ${fours}, ${sixes}, ${sr}, ${opponentName}, ${venue}, ${date}, ${result}`);
                processPlayer(teamName, playerName, runs, balls, fours, sixes, sr, opponentName, venue, date, result);
            }
            // if(numberOfTds.length == 8){
            //     //let stats = searchTool(numberOfTds).text();
            //     //content += stats;
                
            //         let data = {
            //             "team": teamName,
            //             "outBy":  searchTool(numberOfTds[1]).text(),
            //             "runs":  searchTool(numberOfTds[2]).text(),
            //             "balls":  searchTool(numberOfTds[3]).text(),
            //             "four":  searchTool(numberOfTds[5]).text(),
            //             "six":  searchTool(numberOfTds[6]).text(),
            //             "sr":  searchTool(numberOfTds[7]).text()
            //         }

            //         json[searchTool(numberOfTds[0]).text().trim()] = data;
              
                //   json.push(searchTool(numberOfTds[0]).text(), searchTool(numberOfTds[1]).text(),
                //     searchTool(numberOfTds[2]).text(), searchTool(numberOfTds[3]).text(), searchTool(numberOfTds[5]).text(),
                //     searchTool(numberOfTds[6]).text(), searchTool(numberOfTds[7]).text(), teamName);
         //   }
        }
        console.log('``````````````````````````````````````````````````````````');
        //fs.writeFileSync(`innings${i+1}.html`, scoreCard);
    }

    // for(let i in json){
    //     console.log(json[i]);
    // }
 
     // console.log(content);
     //console.log(json);
    // for(let i in json){
    //    // console.log(json[i][0]['team'])
    //    let dirPath = path.join(process.cwd(), 'players');
    //    if(!fs.existsSync(dirPath)){
    //        fs.mkdirSync(dirPath);
    //    }
    //     let teamPath = path.join(dirPath, json[i]['team']);
    //     if(!fs.existsSync(teamPath)){
    //         fs.mkdirSync(teamPath);
    //     }

    //         let data={};
    //         data[i] = [];

    //         let playerPath =  path.join(teamPath, i+'.json');
    //         if(!fs.existsSync(playerPath)){
    //             fs.writeFileSync(playerPath, JSON.stringify(data));
    //         }

    //         data = fs.readFileSync(playerPath);
    //         data = JSON.parse(data);

    //         // if(typeof data[i]=='undefined'){
    //         //     data[i] = [];
    //         // }
    //         data[i].push(json[i]);
         
            
    //         data = JSON.stringify(data);
    //         fs.writeFileSync(playerPath, data);

       
   // }
}

// function jsoncb(error, response, playerName, outBy, runs, balls, four, six, sr, teamName){
//     if(error){
//         console.log('error:', error); //Print the error if one occurered
//     }
//     else if(response.statusCode == 404){
//         console.log("Page Not Found");
//     }
//     else{
//        // console.log(html); // Print the HTML for the request
//         return playerJson(playerName, outBy, runs, balls, four, six, sr, teamName); 
//     }
// }


// function playerJson(playerName, outBy, runs, balls, four, six, sr, teamName){
//     let json = {};

//     json[playerName] = [];
//     let data = {
//         "team": teamName,
//         "outBy": outBy,
//         "runs": runs,
//         "balls": balls,
//         "four": four,
//         "six": six,
//         "sr": sr
//     }

//     json[playerName].push(data);
//     console.log(json);
//     return json;
// }

function  processPlayer(teamName, playerName, runs, balls, fours, sixes, sr, opponentName, venue, date, result)
{
    let teamPath = path.join(__dirname, "ipl", teamName);
    dirCreator(teamPath);
    let filePath = path.join(teamPath, playerName + ".xlsx");
    let content = excelReader(filePath, playerName);
    let playerObj = {
        teamName,
        playerName,
        runs,
        balls,
        fours,
        sixes,
        sr,
        opponentName,
        venue,
        date,
        result
    }

    content.push(playerObj);

    excelWriter(filePath, content, playerName);
}

function dirCreator(filePath){
    if(!fs.existsSync(filePath)){
        fs.mkdirSync(filePath);
    }
}

function excelWriter(filePath, json, sheetName){
    // new worksheet
    let newWB = xlsx.utils.book_new();
    // json data -> excel format convert
    let newWS = xlsx.utils.json_to_sheet(json);
    // -> newWB, WS, sheetname
    xlsx.utils.book_append_sheet(newWB, newWS, sheetName);
    // filePath
    xlsx.writeFile(newWB, filePath);
}

function excelReader(filePath, sheetName){
    if(!fs.existsSync(filePath)){
        return [];
    }
    // workbook get
    let wb = xlsx.readFile(filePath);
    // sheet get
    let excelData = wb.Sheets[sheetName];
    // sheet data get
    let ans = xlsx.utils.sheet_to_json(excelData);
    return ans;
}


console.log("After2");

module.exports = {
    psm: processSingleMatch
}