# IPL Web Scrapper

The aim of this project was to extract information of all teams and their players that played in Indian Premier League through web scrapping. The data was extracted from <a href="https://www.espncricinfo.com">www.espncricinfo.com</a>  which provides all the data regarding cricket that is publically available. 

The project uses JavaScript libraries such as <b>request</b> and <b>cheerio</b> to get site links and to extract data. The data is then processed and converted into <b>json</b> format. Finally the json data is converted to excel data using <b>xlsx</b> library. To create and maintain folder to store the data <b>fs</b> and <b>path</b> libraries are also used.

## Installation
First of all you have to prepare your environment. Select
a location where you want to store the files. I'm also on a windows machine, but you should be able to figure it out for any other platform. First you need nodejs, install it. Then, you need to install these js libraries.

    npm i cheerio
    npm i request
    npm i xlsx

To run the code simply run the main.js file in command prompt or visual code or any other 

    node main.js