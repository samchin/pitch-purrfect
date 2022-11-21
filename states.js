
toggleManualSettings(false);
toggleDevSettings(false);

let stateObject = {};
let trialObject = {};


function initializeTrial(){
    trialObject.startTime = Date.now();
    trialObject.correctNote = 0;
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
    stateObject.fixedC = 0;
    trialObject.baseIndex = 0;

    stateObject.meloharmonic = "Melodic";

    stateObject.audioFeedback = 0;
    stateObject.visualFeedback = 0;

    stateObject.visualInput = 0;
    stateObject.hapticInput = 0;
    stateObject.cheatInput = 0;

    stateObject.mode = "Training";

    stateObject.sustain = 0;
    stateObject.trialDelay = 1500;
    stateObject.sensoryDelay = 200;
    stateObject.intranoteDelay = 700;
    stateObject.intrahapticDelay = 300;

    stateObject.streak = 0;

    stateObject.trialNumber = 0;
    stateObject.trialObject = trialObject;
}

function sendData() {
    console.log(JSON.stringify(stateObject))

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

function blankButtons() {
    $("#trainButton").css("border-color", "transparent");
    $("#testButton").css("border-color", "transparent");
    $("#manualButton").css("border-color", "transparent");
    $("#devButton").css("border-color", "transparent");
    toggleManualSettings(false);
    toggleDevSettings(false);
}
function setTraining() {
    blankButtons();
    stateObject.mode = "Training"
    $("#trainButton").css("border-color", "grey");
    initialize();
}

function setTest() {
    blankButtons();
    stateObject.mode = "Test";
    $("#testButton").css("border-color", "grey");
    initialize();
}

function setManual() {
    initializeState();
    sendData();
    blankButtons();
    stateObject.mode = "Manual";
    $("#manualButton").css("border-color", "grey");
    toggleManualSettings(true);
}

function setDev() {
    blankButtons();
    stateObject.mode = "Dev";
    $("#devButton").css("border-color", "grey")
    toggleDevSettings(true);
    initialize();
}