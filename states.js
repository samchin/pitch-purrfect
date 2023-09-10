
toggleManualSettings(false);
toggleDevSettings(false);

let stateObject = {};
let trialObject = {};


function initializeTrial(){
    trialObject.startTime = Date.now();
    trialObject.correctIndexval = 0;
    trialObject.userGuesses = Array(0);
    trialObject.guessTimes = Array(0);
    trialObject.repeats = 0;
    trialObject.endTime = 0;
}


function endTrial(guessTime){
    trialObject.endTime = guessTime
    sendData();
}

function initializeState(){
    stateObject.deId = "";
    stateObject.fixedC = 0;
    stateObject.baseIndex = 0;

    stateObject.audioFeedback = 0;
    stateObject.visualFeedback = 0;

    stateObject.visualInput = 0;
    stateObject.hapticInput = 0;
    stateObject.cheatInput = 0;

    stateObject.mode = "Training";

    stateObject.sustain = 1;
    stateObject.trialDelay = 2000;
    stateObject.sensoryDelay = 200;
    stateObject.intranoteDelay = 700;
    stateObject.intrahapticDelay = 700;

    stateObject.streak = 0;

    stateObject.trialNumber = 0;
    // stateObject.trialObject = trialObject;

    if(document.getElementById("hapticInput").checked === true){
        stateObject.hapticInput = 1;
    }
}

function sendData() {
    console.log(JSON.stringify(trialObject))
    console.log(JSON.stringify(stateObject))
    var comb_json = Object.assign({}, stateObject, trialObject);
    console.log(JSON.stringify(comb_json))


    let json_str = JSON.stringify(trialObject)
    const url = "https://script.google.com/macros/s/AKfycbwo6-LqbSpb8B2YM6W0xr5qHkO5sPUDZjiZu5oH01SZ362sGvm_LsWDRKvII7UzLAwKug/exec";
    fetch(url,{
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'no-cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    headers: {
      'Content-Type': 'application/json'
    },
    redirect: 'follow', // manual, *follow, error
    // body: JSON.stringify({"timestamp": 123,"keypress":"test"}) // body data type must match "Content-Type" header
    body: JSON.stringify(comb_json)
  });

}



function toggleSpatialSettings(enable) {
    if (!enable) {
        $('#spatialSettings').removeClass("d-flex");
        $('#spatialSettings').hide();
    } else {
        $('#spatialSettings').show();
        $('#spatialSettings').addClass("d-flex");
    }
}



function toggleManualSettings(enable) {
    if (!enable) {
        $('#manualSettings').removeClass("d-flex");
        $('#manualSettings').hide();
    } else {
        $('#manualSettings').show();
        $('#manualSettings').addClass("d-flex");
    }
}

function toggleDevSettings(enable) {
    if (!enable) {
        $('#devSettings').removeClass("d-flex");
        $('#devSettings').hide();
    } else {
        $('#devSettings').show();
        $('#devSettings').addClass("d-flex");
    }
}

function updateSliderValue(textid, val) {
    document.getElementById(textid.value=$(val).val());
}

function blankButtons() {
    $("#trainButton").css("border-color", "transparent");
    $("#testButton").css("border-color", "transparent");
    $("#manualButton").css("border-color", "transparent");
    $("#devButton").css("border-color", "transparent");
    $("#spatialButton").css("border-color", "transparent");
    toggleManualSettings(false);
    toggleDevSettings(false);
    toggleSpatialSettings(false);

}
function setTraining() {
    blankButtons();
    stateObject.mode = "Training"
    $("#trainButton").css("border-color", "grey");
    stateObject.streak = 0;
    $('#streakBox').hide();
    initialize();

}

function setSpatial() {
    blankButtons();
    stateObject.mode = "Spatial"
    $("#spatialButton").css("border-color", "grey");
    stateObject.streak = 0;
    $('#streakBox').show();
    initialize();

    toggleSpatialSettings(true);
}

function setTest() {
    blankButtons();
    stateObject.mode = "Test";
    $("#testButton").css("border-color", "grey");
    // streakBox.hidden = false;
    $('#streakBox').show();
    stateObject.streak = 0;
    streak.textContent = stateObject.streak;
    initialize();
}

function setManual() {
    // initialize();
    sendData();
    blankButtons();
    stateObject.mode = "Manual";
    $("#manualButton").css("border-color", "grey");
    $('#streakBox').hide();
    stateObject.streak = 0;
    streak.textContent = stateObject.streak;

    toggleManualSettings(true);
}



function setDev() {
    blankButtons();
    stateObject.mode = "Dev";
    $("#devButton").css("border-color", "grey")
    toggleDevSettings(true);
    initialize();
}