

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

let numHaptic = 8;
const hapArr = [9,0,1,2,6,5,4,3,7]


// let sustain = 0;
// let trialDelay = 1500;
// let sensoryDelay = 200;
// let intranoteDelay = 300;
// let params = [sustain, trialDelay, sensoryDelay, intranoteDelay];

let testNote = randomIndexval(1, 8);
let baseIndex = 0;

function initialize(e){
	testNote = randomIndexval(0, 7)
	setTimeout(() => { playNote(testNote) }, 100)
}

streak.textContent += stateObject.streak;
prompt.textContent += testNote

function setSettings(e){
	stateObject.sustain = $('#Sustain').val();
	stateObject.trialDelay = $('#trialDelay').val();
	stateObject.sensoryDelay = $('#sensoryDelay').val();
	stateObject.intranoteDelay = $('#intranoteDelay').val();

	if ($('#hapticInput').val() == 1){
		stateObject.hapticInput = 1;
	}

	if ($('#fixedC').val() == 1){
		stateObject.baseIndex = 24
	}
}

function playNote(indexval) {
	console.log("playnote")
	// NOTE: indexval = interval - 1
	// use indexval for anything that isn't user facing
	document.body.style.background = "#ffffff";

	setSettings();

	testNote = indexval
	prompt.textContent = indexval + 1
	topIndex = baseIndex + majorIntervals[indexval]

	sampler.triggerAttackRelease([allNotes[baseIndex],allNotes[topIndex]], stateObject.sustain)

	if (stateObject.hapticInput == 1) {

		let hapticBase = hapArr[numHaptic] //last haptic module
		console.log("hapBase index: ")
		console.log(hapticBase)

		bleInstance.requestSetChannelGainUpdate(hapticBase, hapticBase);

		setTimeout(function () {
			let hapTop = hapArr[numHaptic-indexval]
			console.log("hapTop index: ")
			console.log(numHaptic-indexval)
			bleInstance.requestSetChannelGainUpdate(hapTop, hapTop);
		}, 300);
	}

	guesses.textContent = ''
}

function randomIndexval(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min)
}

function checkNote(e) {
	// if (stateObject.trialNumber %2 == 0){
	// 	stateObject.hapticInput = 1;
	// 	stateObject.cheatInput = 1;
	// }
	//
	// if (stateObject.trialNumber %2 == 1){
	// 	stateObject.hapticInput = 0;
	// 	stateObject.cheatInput = 0;
	// }

	const guessTime = Date.now();
	const keynumber = Number(e.code.match(regex))
	const indexval = keynumber - 1

	setSettings();
	sendData();

	updateTrial(guesses.textContent, guessTime);

	if (stateObject.mode === "Test") {
		endTrial(guessTime);
		document.body.style.background = "#808080";
		baseIndex = baseIndex + majorIntervals[indexval]

		if (baseIndex > 36) {
			baseIndex = randomIndexval(0, 7)
		}

		if (stateObject.fixedC == 1) {
			baseIndex = 24
		}

		testNote = randomIndexval(0, 7)

		initializeTrial(indexval);

		setTimeout(() => {
			playNote(testNote)
		}, stateObject.trialDelay);
	}

	else {
		if (indexval < 0) {
			playNote(testNote);
			trialObject.repeats += 1;

		} else {

			if (indexval === testNote) {
				endTrial(guessTime);
				stateObject.trialNumber += 1;

				document.body.style.background = "#2a9d8f";
				sampler.triggerAttackRelease([allNotes[baseIndex], allNotes[baseIndex + majorIntervals[indexval]]], stateObject.sustain)

				//Streak
				stateObject.streak++
				streak.textContent = stateObject.streak;

				//Generate new note
				console.log("Correct")

				baseIndex = baseIndex + majorIntervals[indexval]
				// console.log(baseIndex)

				if (baseIndex > 36) {
					baseIndex = randomIndexval(0, 7)
				}

				if (stateObject.fixedC === 1) {
					baseIndex = 24
				}

				testNote = randomIndexval(0, 7)

				setTimeout(() => {
					playNote(testNote)
				}, stateObject.trialDelay);

				initializeTrial(indexval);

			} else {
				document.body.style.background = "#e76f51";
				guesses.textContent += indexval
				stateObject.streak = 0
				streak.textContent = stateObject.streak;

				if (stateObject.audioFeedback === 1) {
					sampler.triggerAttackRelease([allNotes[baseIndex], allNotes[baseIndex + majorIntervals[indexval]]], stateObject.sustain)

				}
			}
			//console.log(keyinput)


		}
	}
}

