let puppeteer = require("puppeteer");
let cTab;
let link = "https://youtube.com/playlist?list=PL-Jc9J83PIiEeD3I4VXETPDmzJ3Z1rWb4" ;
let minTime = []
let hourTime = []
let totalSeconds = 0;


(async function () {
    try {
        let browserOpen = await puppeteer.launch({
            headless: false,
            defaultViewport: null
        })

        let browserInstance = await browserOpen;
        let tabsArr = await browserInstance.pages();
        cTab = tabsArr[0];
        await cTab.goto(link);
        await cTab.waitForSelector("h1#title");
        let name = await cTab.evaluate(function(select){return document.querySelector(select).innerText},"h1#title")
        let allData = await cTab.evaluate(getData , "#stats .style-scope.ytd-playlist-sidebar-primary-info-renderer")
        console.log(name , allData.noOfVideos, allData.noOfViews)

        let totalVideos = allData.noOfVideos.split(" ")[0];
        console.log(totalVideos);

        let currentVideos = await getCvideosLength();
        console.log(currentVideos)

        while(totalVideos - currentVideos >= 20){
            await scrollToBottom();
            currentVideos = await getCvideosLength();
        }

        let finalList = await getStats();
        console.log(finalList.currentList);

        let totalTimeArr = finalList.totalWatchTime
        console.log(totalTimeArr);
        let handledtime = await handleTime(totalTimeArr);
        console.log(minTime)
        console.log(hourTime)
        let minSecTime = await convertMinIntoSeconds(handledtime.minTime)
        let hourSecTime = await convertHourIntoSeconds(handledtime.hourTime) 
        totalSeconds = minSecTime + hourSecTime
        let timeInhour = parseFloat(totalSeconds/3600).toFixed(2)
        console.log(timeInhour + "hours");
    }

    catch (error) {
       console.log(error)
    }


})()

function getData(selector){
   let allEle = document.querySelectorAll(selector)
   let noOfVideos = allEle[0].innerText;
   let noOfViews = allEle[1].innerText;
   return{
       noOfVideos,
       noOfViews
   }
}

async function getCvideosLength(){
    let videosLength = await cTab.evaluate(getLength , "#container>#thumbnail span.style-scope.ytd-thumbnail-overlay-time-status-renderer");
    return videosLength;
}

async function scrollToBottom(){
    await cTab.evaluate(goToBottom);
    function goToBottom(){
        window.scrollBy(0, window.innerHeight)
    }
}

function getLength(selector){
    let durLength = document.querySelectorAll(selector);
    return durLength.length;
}

async function getStats(){
   console.log("i am in get stats")
   let list = cTab.evaluate(getNameAndDuration, "#video-title","#container>#thumbnail span.style-scope.ytd-thumbnail-overlay-time-status-renderer")
   return list;
}

function getNameAndDuration(videoSelector , durationSelector){
    console.log("i am in getName and duration")
    let videoElem = document.querySelectorAll(videoSelector)
    let durationElem = document.querySelectorAll(durationSelector)

    let currentList = []
    let totalWatchTime = []

    for(let i=0 ; i<durationElem.length; i++){
        let videoTitle = videoElem[i].innerText
        let duration = durationElem[i].innerText
        let totalDuration = durationElem[i].innerText
        currentList.push({videoTitle,duration})
        totalWatchTime.push(totalDuration);
    }

    return {
        currentList,
        totalWatchTime
    }
        
}

async function handleTime(totalWatchTime) {
    console.log("in handle time")
    for (let i = 0; i < totalWatchTime.length; i++) {
        if (totalWatchTime[i].length <= 5) {
            minTime.push(totalWatchTime[i])
        } else {
            if(totalWatchTime[i].length>5 && totalWatchTime[i].length<8)
            hourTime.push(totalWatchTime[i])
        }
    }
    return {
        minTime, hourTime
    }
}

async function convertMinIntoSeconds(time){
    console.log("mintosec")
    for(let i=0; i< time.length ; i++){
        let timeArr = time[i].split(":")
        let minInSec = parseInt(timeArr[0]*60);
        totalSeconds += (minInSec + parseInt(timeArr[1]))
    }
    return totalSeconds;
}

async function convertHourIntoSeconds(time){
    console.log("hourtosec")
    for(let i=0; i< time.length ; i++){
        let timeArr = time[i].split(":")
        let hourInSec = parseInt(timeArr[0]*60*60);
        let minInSec = parseInt(timeArr[1]*60)
        totalSeconds += (minInSec +hourInSec + parseInt(timeArr[2]))
    }
    return totalSeconds;
}