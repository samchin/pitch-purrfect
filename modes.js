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

toggleManualSettings(false);
toggleDevSettings(false);
let isTrain = true;
let isTest = false;
let isManual = false;
let isDev = false;

function setTraining() {
    isTrain = true;
    isTest = false;
    isManual = false;
    isDev = false;
    $("#trainButton").css("border-color", "grey");
    $("#testButton").css("border-color", "transparent");
    $("#manualButton").css("border-color", "transparent");
    $("#devButton").css("border-color", "transparent");
    toggleManualSettings(false);
    toggleDevSettings(false);
    initialize();
}

function setTest() {
    isTrain = false;
    isTest = true;
    isManual = false;
    isDev = false;
    $("#trainButton").css("border-color", "transparent");
    $("#testButton").css("border-color", "grey");
    $("#manualButton").css("border-color", "transparent");
    $("#devButton").css("border-color", "transparent")
    toggleManualSettings(false);
    toggleDevSettings(false);
    initialize();
}

function setManual() {
    isTrain = false;
    isTest = false;
    isManual = true;
    isDev = false;
    $("#trainButton").css("border-color", "transparent");
    $("#testButton").css("border-color", "transparent");
    $("#manualButton").css("border-color", "grey");
    $("#devButton").css("border-color", "transparent")
    toggleManualSettings(true);
    toggleDevSettings(false);

}

function setDev() {
    isTrain = false;
    isTest = false;
    isManual = false;
    isDev = true;
    $("#trainButton").css("border-color", "transparent");
    $("#testButton").css("border-color", "transparent");
    $("#manualButton").css("border-color", "transparent");
    $("#devButton").css("border-color", "grey")
    toggleManualSettings(false);
    toggleDevSettings(true);
    initialize();
}