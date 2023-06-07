let pi = Math.PI
let turn = 2*pi

// let timeScale = {
//     millenaire: { steps: 10, },
//     siecle: { steps: 10 },
//     decennie: { steps: 10 },
//     an: { steps: 10 },
//     mois: { steps: 12 },
//     semaine: { steps: 4 },
//     jour: { steps: 7 },
//     heure: { steps: 24 },
//     minute: { steps: 60 },
//     seconde: { steps: 60 },
// }


const readline = require('node:readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Enter a date in timestamp in format "2023-10-04T22:00:00.000Z" ', (answer) => {
    // TODO: Log the answer in a database
    console.log(`Your date: ${answer}`);
    //calcul(answer)
    let diff = dateDiff(answer)
    console.log(diff)
    rl.close();
});


function dateDiff(date) {
    console.log("your date ", new Date(date))
    var d = Math.abs(new Date(date).getTime() - new Date().getTime()) / 1000;                 // delta
    var r = {};                                                                // result
    var s = {    
        millenaire: 3153600000,  
        siecle: 3153600000,    
        decennie: 315360000,                                                            // structure
        year: 31536000,
        month: 2592000,
        week: 604800, // uncomment row to ignore
        day: 86400,   // feel free to add your own row
        hour: 3600,
        minute: 60,
        second: 1
    };
    var a = {
        millenaire : turn/10,
        siecle : turn/10,
        decennie : turn /10,
        year : turn /10,
        month : turn /12,
        week : turn / 4,
        day : turn / 7,
        hour : turn / 24,
        minute : turn/ 60,
        second : turn / 60
    }

    Object.keys(s).forEach(function (key) {
        r[key] = {nb: Math.floor(d / s[key])};
        r[key].angle = r[key].nb * a[key]
        d -= r[key].nb * s[key];
    });

    return r;
};

// function calcul(date) {
//     var calcNewYear = setInterval(function () {
//         //date_future = new Date(new Date().getFullYear() +1, 0, 1);
//         date_future = new Date(date)
//         console.log("your date", date_future)
//         date_now = new Date();
//         console.log(date_now)

//         seconds = Math.floor((date_future - (date_now)) / 1000);
//         minutes = Math.floor(seconds / 60);
//         hours = Math.floor(minutes / 60);
//         days = Math.floor(hours / 24);
//         weeks = Math.floor(days / 7);
//         months = Math.floor(weeks / 4)
//         years = Math.floor(months / 12)
//         decennies = Math.floor(years / 10)
//         siecles = Math.floor(decennie / 10)
//         millenaires = Math.floor(siecles / 10)

//         siecles = siecles - (millenaires / 10)
//         decennies = decennies - (siecles / 10)
//         years = years - (decennies / 10)
//         months = months - (years / 12)
//         weeks = weeks - (months * 4)
//         days = days - (weeks * 7)
//         hours = hours - (days * 24);
//         minutes = minutes - (days * 24 * 60) - (hours * 60);
//         seconds = seconds - (days * 24 * 60 * 60) - (hours * 60 * 60) - (minutes * 60);

//         console.log("Time until date:\nDays: " + days + " Hours: " + hours + " Minutes: " + minutes + " Seconds: " + seconds);
//     }, 1000);
// }