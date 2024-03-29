

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
		// "F#5": "Fs5.mp3",
		// A5: "A5.mp3",
		// C6: "C6.mp3",
		// "D#6": "Ds6.mp3",
		// "F#6": "Fs6.mp3",
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

const spatialPairs = [[0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7],
					  [1, 2], [1, 3], [1, 4], [1, 5], [1, 6], [1, 7],
					  [2, 3], [2, 4], [2, 5], [2, 6], [2, 7],
					  [3, 4], [3, 5], [3, 6], [3, 7],
					  [4, 5], [4, 6], [4, 7],
					  [5, 6], [5, 7],
					  [6, 7]];



const regex = /\d+/g;
const notes = ["C4", "D4", "E4", "F4", "G4", "A5", "B5", "C5"];
const majorIntervals = [0, 2, 4, 5, 7, 9, 11, 12];
const allNotes = [	"C2", "C#2", "D2", "D#2", "E2", "F2", "F#2", "G2", "G#2", "A2", "A#2", "B2",
					"C3", "C#3", "D3", "D#3", "E3", "F3", "F#3", "G3", "G#3", "A3", "A#3", "B3",
					"C4", "C#4", "D4", "D#4", "E4", "F4", "F#4", "G4", "G#4", "A4", "A#4", "B4"];


const allVisuals = ["visual/1-1.png", "visual/1-2.png", "visual/1-3.png", "visual/1-4.png", 
					"visual/1-5.png", "visual/1-6.png", "visual/1-7.png", "visual/1-8.png" ]

window.addEventListener('keydown', _.debounce(checkNote, 500));

// stateObject.baseIndex = 20;
let numHaptic = 8;
const hapArr = [9,0,1,2,6,5,4,3,7]
stateObject.streak = 0;

guesses.textContent = " ";
streak.textContent += stateObject.streak;
prompt.textContent += trialObject.correctIndexval;

function initialize(e){
	trialObject.correctNote = randomIndexval(0, 7)
	setTimeout(() => { playNote(trialObject.correctIndexval) }, 100)
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
		stateObject.baseIndex = 24
	}
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}



function playNote(indexval, color) {

	// NOTE: indexval = interval - 1
	// use indexval for anything that isn't user facing
	document.body.style.background = color;
	setSettings();


	trialObject.correctNote = indexval
	prompt.textContent = indexval + 1
	topIndex = stateObject.baseIndex + majorIntervals[indexval]

	sampler.triggerAttackRelease(allNotes[stateObject.baseIndex], stateObject.sustain)

	document.getElementById("visualImage").src=allVisuals[indexval]

	console.log(document.getElementById("visualImage").src=allVisuals[indexval])


	setTimeout(function () {
		sampler.triggerAttackRelease(allNotes[topIndex], stateObject.sustain)
	}, stateObject.intranoteDelay);

	if (stateObject.hapticInput === 1) {
			let hapticBase = hapArr[numHaptic] //last haptic module
			// console.log("hapBase index: ")
			// console.log(hapticBase)

			bleInstance.requestSetChannelGainUpdate(hapticBase, hapticBase);
			// console.log("HAPTIC")
			// console.log("-----")

			setTimeout(function () {
				let hapTop = hapArr[numHaptic - indexval]
				// console.log("hapTop index: ")
				// console.log(numHaptic - indexval)
				bleInstance.requestSetChannelGainUpdate(hapTop, hapTop);
			}, stateObject.intrahapticDelay);
		
	}

	// guesses.textContent = ''
}



function randomIndexval(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min)
}

function newNote(oldIndexval){

	// Make the old top index, the new base index by passing in the oldIndexval
	stateObject.baseIndex = stateObject.baseIndex + majorIntervals[oldIndexval]
	console.log(stateObject.baseIndex)

	if (stateObject.baseIndex + majorIntervals[7] >= 35) {
		//If the baseIndex + 12 (or majorIntervals[7]) would be over
		// the total number of notes, set it as a new indexval between 0 - 7
		stateObject.baseIndex = randomIndexval(0, 7)
	}

	if (stateObject.fixedC === 1) {
		stateObject.baseIndex = 24
	}

	initializeTrial();

	trialObject.correctIndexval = randomIndexval(0, 7)

	setTimeout(() => {
		guesses.style.display = "none";
		// document.body.style.background = "#ffffff";
		playNote(trialObject.correctIndexval, "#ffffff")
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
	keynumber = Number(e.code.match(regex))
	if (e.code === 'Digit0'){
		keynumber = 9
	}

	const indexval = keynumber - 1
	let color = "#ffffff"


	setSettings();

	if (indexval < 0) { // REPEAT
		// document.body.style.background = "#ffffff";
		guesses.style.display = "none";

		playNote(trialObject.correctIndexval, "#ffffff");
		trialObject.repeats += 1;

	} else { 

		if (stateObject.mode === "Test") { // SINGLE GUESS
			// endTrial(guessTime);
			document.body.style.background = "#808080";
			// guesses.style.display = "block";
			// newNote(indexval);
			// guesses.textContent = trialObject.correctIndexval + 1;
	
			trialObject.guessTimes = guessTime;
			trialObject.userGuesses = indexval;
			updateStreak("Correct");
	
			endTrial(guessTime);
	
			setTimeout(() => {
				stateObject.trialNumber += 1;
				newNote(trialObject.correctIndexval)
			}, 200)	
		} 

		if (stateObject.mode === "Spatial") { // SINGLE GUESS
			document.body.style.background = "#FDDA0D";

			trialObject.guessTimes = guessTime;
			trialObject.userGuesses = -1;
			updateStreak("Correct");
			endTrial(guessTime);
	
			setTimeout(() => {
				stateObject.trialNumber += 1;
				newNote(trialObject.correctIndexval)
			}, 200)	
		} 
		
		else {

			if (stateObject.mode === "Training") {
				guesses.textContent = trialObject.correctIndexval + 1;
				guesses.style.display = "block";

				trialObject.guessTimes = guessTime;
				trialObject.userGuesses = indexval;

				if (indexval === trialObject.correctIndexval) { // CORRECT
					// Mark Correct
					// updateStreak("Correct");
					color = "#2a9d8f";

				} else { // INCORRECT
					// Mark Correct
					// updateStreak("Incorrect");
					color = "#e76f51";

				}

				endTrial(guessTime);
				document.body.style.background = color;


				setTimeout(() => {
					stateObject.trialNumber += 1;
					newNote(trialObject.correctIndexval)
				}, 200)

			}
		}


	}
}

