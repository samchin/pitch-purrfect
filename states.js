
toggleManualSettings(false);
toggleDevSettings(false);


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