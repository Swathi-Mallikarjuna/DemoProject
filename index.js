
var _GBL_launchYear = [];
var _GBL_missionDetails = {};

async function getonLoadPage(url) {
    const initialJson = await ajaxRequest(url);
    populateOnloadPageData(initialJson);
}

function populateOnloadPageData(initialJson) {
    let launchYearArray = getLaunchYear(initialJson);
    collateLaunchYear(launchYearArray);
    getMissionName(initialJson);
    collateMissionDetails()
    
}

function getLaunchYear(initialJson) {
    let launchYearArray = []
    for (let i = 0; i < initialJson.length; i++) {
        launchYearArray[i] = initialJson[i].launch_year;
    }

    for (var value of launchYearArray) {
        if (_GBL_launchYear.indexOf(value) === -1) {
            _GBL_launchYear.push(value);
        }
    }
    return _GBL_launchYear;
}

function collateLaunchYear(launchYearArray){
    let launchYearArrayCount = 0;
    let myTableDiv = $('.table-year-filter');
    let html = "";
    for (let j = 0; j < 15; j++) {
        html = html + `<tr class="table-year-filter-rows-${j}"></tr>`;
    }
    myTableDiv.append(html);
    var rowLength = $('.table-year-filter').children().length;
    for (let i = 0; i < rowLength; i++) {
        var nameofRow = `.table-year-filter-rows-${i}`
        var rowText = "";
        if (launchYearArray[launchYearArrayCount] != undefined || launchYearArray[launchYearArrayCount != null]) {
            for (let j = 0; j < 2; j++) {
                rowText = rowText + `<td class="table-year-filter-cell-${j}">
                <div id="launchYearArrayInput">
                <input type="button" value=${launchYearArray[launchYearArrayCount++]} id="searchByYear_${launchYearArrayCount}" class="rounded-sm" onClick=seachbyYearFunction(this);>
                </div>
                </td>`
            }
        }
        $(nameofRow).html(rowText);
        $('#launchLand').show();
        $('#side').show();
    }
}

function getMissionName(initialJson){
 let missionDetailsObj = [], missionNameArray=[], flightNumArray = [], launchSuccess = [];
 for (let i = 0; i < initialJson.length; i++) {
     missionDetailsObj[i] = {};
     missionDetailsObj[i]["missionName"] = initialJson[i].mission_name;
     missionDetailsObj[i]["missionId"] = initialJson[i].flight_number;
     missionDetailsObj[i]["launchSuccess"] = initialJson[i].launch_success;
     missionDetailsObj[i]["launchYear"] = initialJson[i].launch_year;
     missionDetailsObj[i]["landSuccessfull"] = initialJson[i].rocket.first_stage.cores[0].land_success;
     missionDetailsObj[i]["imagePath"] = initialJson[i].links.mission_patch_small;
}
_GBL_missionDetails = {};
_GBL_missionDetails= missionDetailsObj;
}

function collateMissionDetails() {
    let html = "";
    let spaceXDetailsDiv = $('#spaceXDetails');
    let signature = $('#signature');
    for(let i in _GBL_missionDetails) {
        html = html + `
        <div class="" id="details">
        <div class="card">
        <img src=${_GBL_missionDetails[i]["imagePath"]} class="card-img-top" alt="...">
        <div class="card-body">
        <h8 class="card-title">${_GBL_missionDetails[i]["missionName"]} #${_GBL_missionDetails[i]["missionId"]}</h8>
        <p class="card-text" id="mission-id">Mission Id:</p>
        <ul>
        <li>${_GBL_missionDetails[i]["missionId"]}</li>
        </ul>
        <p class="card-text" id="launch-year">Launch Year:
        <span>${_GBL_missionDetails[i]["launchYear"]}</span>
        </p>
        <p class="card-text" id="successfull-launch">Successfull Launch:
        <span>${_GBL_missionDetails[i]["launchSuccess"]}</span>
        </p>
        <p class="card-text" id="successfull-landing">Successfull Landing:
        <span>${_GBL_missionDetails[i]["landSuccessfull"]}</span>
        </p>
        </div>
        </div>
        </div>
        </div>`;
    }
    spaceXDetailsDiv.html(html);
    $('#signature').show();
}

function seachbyYearFunction(id) {
    let buttonValue = $(id).val();
    let url = `https://api.spaceXdata.com/v3/launches?limit=100&launch_year=${buttonValue}`;
    let spaceXDetailsDiv = $('#spaceXDetails');
    $("#spaceXDetails").empty();
    getEachYearData(url)
}

async function getEachYearData(url) {
    const initialJson = await ajaxRequest(url);
    getMissionName(initialJson);
    collateMissionDetails()
}

async function ajaxRequest(url) {
    var result = $.ajax({
        url: url,
        type: 'get',
        dataType: 'json',
        async: false,
      }); 
   return result.responseJSON;
}

async function successfullLaunch(isSuccessfullLaunch) {
 const url = `https://api.spacexdata.com/v3/launches?limit=100&launch_success=${isSuccessfullLaunch.toLowerCase()}`;
 const data = await ajaxRequest(url);
 $("#spaceXDetails").empty();
 getMissionName(data);
 collateMissionDetails(); 
}

async function successfullLand(isSuccessfullLand) {
    const url = `https://api.spacexdata.com/v3/launches?limit=100&land_success=${isSuccessfullLand.toLowerCase()}`;
    const data = await ajaxRequest(url);
    $("#spaceXDetails").empty();
    getMissionName(data);
    collateMissionDetails(); 
   }

document.addEventListener("DOMContentLoaded", () => {
    getonLoadPage("https://api.spaceXdata.com/v3/launches?limit=100");
});
