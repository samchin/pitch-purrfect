

var bleInstance = new BleManager(updateBatteryVoltage);

/**
 * Updates UI elements when a new battery voltage is received from BLE.
 * @param {float} num The new battery voltage.
 */
function updateBatteryVoltage(num) {
	var element = document.getElementById("batteryVoltage");
	// Keep two decimal points.
	element.innerHTML = parseFloat(num).toFixed(2) + " V";
}

const sampler = new Tone.Sampler({
	urls: {
		//   A0: "A0.mp3",
		//   C1: "C1.mp3",
		//   "D#1": "Ds1.mp3",
		//   "F#1": "Fs1.mp3",
		//   A1: "A1.mp3",
		C2: "C2.mp3",
		"D#2": "Ds2.mp3",
		"F#2": "Fs2.mp3",
		A2: "A2.mp3",
		C3: "C3.mp3",
		"D#3": "Ds3.mp3",
		"F#3": "Fs3.mp3",
		A3: "A3.mp3",
		C4: "C4.mp3",
		"D#4": "Ds4.mp3",
		"F#4": "Fs4.mp3",
		A4: "A4.mp3",
		C5: "C5.mp3",
		"D#5": "Ds5.mp3",
		"F#5": "Fs5.mp3",
		A5: "A5.mp3",
		C6: "C6.mp3",
		"D#6": "Ds6.mp3",
		"F#6": "Fs6.mp3",
		//   A6: "A6.mp3",
		//   C7: "C7.mp3",
		//   "D#7": "Ds7.mp3",
		//   "F#7": "Fs7.mp3",
		//   A7: "A7.mp3",
		//   C8: "C8.mp3"
	},
	release: 1,
	baseUrl: "https://tonejs.github.io/audio/salamander/"
}).toDestination();

const now = Tone.now()
const prompt = document.getElementById('prompt');
const guesses = document.getElementById('guesses');
const streak = document.getElementById('streak');

const regex = /\d+/g;
const notes = ["C4", "D4", "E4", "F4", "G4", "A5", "B5", "C5"]
const majorIntervals = [0, 2, 4, 5, 7, 9, 11, 12];
const allNotes = ["C2", "C#2", "D2", "D#2", "E2", "F2", "F#2", "G2", "G#2", "A3", "A#3", "B3",
	"C3", "C#3", "D3", "D#3", "E3", "F3", "F#3", "G3", "G#3", "A4", "A#4", "B4",
	"C4", "C#4", "D4", "D#4", "E4", "F4", "F#4", "G4", "G#4", "A5", "A#5", "B5",
	"C5", "C#5", "D5", "D#5", "E5", "F5", "F#5", "G5", "G#5"]

window.addEventListener('keydown', checkNote);

let hapticBase = 8;
stateObject.baseIndex = 0;
stateObject.streak = 0;

guesses.textContent = " ";
streak.textContent += stateObject.streak;
prompt.textContent += trialObject.correctNote;

function initialize(e){
	trialObject.correctNote = randomIndexval(0, 7)
	setTimeout(() => { playNote(trialObject.correctNote) }, 100)
}

function setSettings(e){
	stateObject.sustain = $('#Sustain').val();
	stateObject.trialDelay = $('#trialDelay').val();
	stateObject.sensoryDelay = $('#sensoryDelay').val();
	stateObject.intranoteDelay = $('#intranoteDelay').val();
	stateObject.intrahapticDelay = $('#intrahapticDelay').val();

	if ($('#hapticInput').val() == 1){
		stateObject.hapticInput = 1;
	}

	if ($('#fixedC').val() == 1){
		stateObject.stateObject.baseIndex = 24
	}
}

function playNote(indexval, mode = "Harmonic" ) {

	// NOTE: indexval = interval - 1
	// use indexval for anything that isn't user facing
	// document.body.style.background = "#ffffff";

	setSettings();
	$('#guesses').hide();


	trialObject.correctNote = indexval
	prompt.textContent = indexval + 1
	topIndex = stateObject.baseIndex + majorIntervals[indexval]

	if (stateObject.meloharmonic == "Harmonic") {
		sampler.triggerAttackRelease([allNotes[stateObject.baseIndex], allNotes[topIndex]], stateObject.sustain)
	}

	else{ //(stateObject.meloharmonic == "Melodic") {
		sampler.triggerAttackRelease(allNotes[stateObject.baseIndex], stateObject.sustain)

		setTimeout(function () {
			sampler.triggerAttackRelease(allNotes[topIndex], stateObject.sustain)
		}, stateObject.intranoteDelay);
	}


	if (stateObject.hapticInput == 1) {
		bleInstance.requestSetChannelGainUpdate(hapticBase, hapticBase);

		setTimeout(function () {
			let hapticTop = hapticBase - indexval
			bleInstance.requestSetChannelGainUpdate(hapticTop, hapticTop);
		}, 300);
	}

	guesses.textContent = ''
}

function randomIndexval(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min)
}

function newNote(indexval){//Generate new note

	// console.log("Correct")

	stateObject.baseIndex = stateObject.baseIndex + majorIntervals[indexval]
	// console.log(stateObject.baseIndex)

	if (stateObject.baseIndex >= 36) {
		stateObject.baseIndex = randomIndexval(0, 7)
	}

	if (stateObject.fixedC === 1) {
		stateObject.baseIndex = 24
	}

	initializeTrial();

	trialObject.correctNote = randomIndexval(0, 7)

	setTimeout(() => {
		document.body.style.background = "#ffffff";
		playNote(trialObject.correctNote)
	}, stateObject.trialDelay);



}

function updateStreak(result) {
	if (result === "Incorrect") {
		stateObject.streak = 0
		streak.textContent = stateObject.streak;
	}
	if (result === "Correct") {
		stateObject.streak++
		streak.textContent = stateObject.streak;
	}
}


function checkNote(e) {
	const guessTime = Date.now() - trialObject.startTime;
	const keynumber = Number(e.code.match(regex))
	const indexval = keynumber - 1

	setSettings();

	if (stateObject.mode === "Test") { // SINGLE GUESS
		endTrial(guessTime);
		document.body.style.background = "#808080";
		$('#guesses').hide();

		newNote(indexval);
	}

	else { // MULTI-GUESS
		if (indexval < 0) { // REPEAT
			document.body.style.background = "#ffffff";
			$('#guesses').hide();

			playNote(trialObject.correctNote);
			trialObject.repeats += 1;

		} else {
			trialObject.guessTimes.push(guessTime);
			trialObject.userGuesses.push(indexval);

			if (indexval === trialObject.correctNote) { // CORRECT
				// Mark Correct
				updateStreak("Correct");
				document.body.style.background = "#2a9d8f";
				guesses.textContent = indexval

				endTrial(guessTime);
				playNote(indexval);

				stateObject.trialNumber += 1;
				newNote(indexval);

			} else { // INCORRECT
				updateStreak("Incorrect");
				document.body.style.background = "#e76f51";
				guesses.textContent = indexval

				if (stateObject.audioFeedback === 1) {
					sampler.triggerAttackRelease([allNotes[stateObject.baseIndex], allNotes[stateObject.baseIndex + majorIntervals[indexval]]], stateObject.sustain)

				}
			}


		}
	}
}

