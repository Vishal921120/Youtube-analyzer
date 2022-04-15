let totalWatchTime = [
    '15:55', '5:06', '55:04', '1:11:53', '1:23:15', '1:03:50'
]

let minTime = []
let hourTime = []

function handleTime(totalWatchTime) {
    for (let i = 0; i < totalWatchTime.length; i++) {
        if (totalWatchTime[i].length <= 5) {
            minTime.push(totalWatchTime[i])
        } else {
            hourTime.push(totalWatchTime[i])
        }
    }
    return {
        minTime, hourTime
    }
}

handleTime(totalWatchTime);
// console.log(hourTime)

let totalSeconds = 0;
function convertMinIntoSeconds(time){
    for(let i=0; i< time.length ; i++){
        let timeArr = time[i].split(":")
        let minInSec = parseInt(timeArr[0]*60);
        totalSeconds += (minInSec + parseInt(timeArr[1]))
    }
    return totalSeconds;
}
function convertHourIntoSeconds(time){
    for(let i=0; i< time.length ; i++){
        let timeArr = time[i].split(":")
        let hourInSec = parseInt(timeArr[0]*60*60);
        let minInSec = parseInt(timeArr[1]*60)
        totalSeconds += (minInSec +hourInSec + parseInt(timeArr[2]))
    }
    return totalSeconds;
}

convertMinIntoSeconds(minTime)
convertHourIntoSeconds(hourTime)
// console.log(totalSeconds);

let timeInhour = parseFloat(totalSeconds/3600).toFixed(2)
console.log(timeInhour);