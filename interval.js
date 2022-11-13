

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
	//   C2: "C2.mp3",
	//   "D#2": "Ds2.mp3",
	//   "F#2": "Fs2.mp3",
	//   A2: "A2.mp3",
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
	//   C6: "C6.mp3",
	//   "D#6": "Ds6.mp3",
	//   "F#6": "Fs6.mp3",
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


	let hapticInput = 0;

	let sustain = 1;
	let trialDelay = 1500;
	let sensoryDelay = 200;
	let intranoteDelay = 0;

	let streakCounter = 0;

	let testNote = randomInterval(1, 8);
	let baseIndex = 0;

	// function intervalInKey(base){
	// 	baseIndex = allNotes.indexOf(base)
	// 	interval = randomInterval(1, 8)
	// 	console.log("interval is")
	// 	console.log(interval)
	// 	numHalfSteps = majorIntervals(interval)
	//
	// 	topIndex = baseIndex + numHalfSteps
	//
	// 	console.log(topIndex)
	// 	console.log(baseIndex)
	//
	// 	return (topIndex, baseIndex)
	// }

	function initialize(e){
		testNote = randomInterval(0, 7)
		setTimeout(() => { setNote(testNote) }, 100)
		}


	streak.textContent += streakCounter;
	prompt.textContent += testNote

	function setSettings(e){
		sustain = $('#Sustain').val();
		trialDelay = $('#trialDelay').val();
		sensoryDelay = $('#sensoryDelay').val();
		intranoteDelay = $('#intranoteDelay').val();

		hapticInput =  $('hapticInput').val();

		if ($('#fixedC').val() == 1){
			baseIndex = 24
		}
	}

	function setNote(indexval) {
		// NOTE: indexval = interval - 1
		// use indexval for anything that isn't user facing

		setSettings();
		document.body.style.background = "white";

		testNote = indexval
		prompt.textContent = indexval + 1
		topIndex = baseIndex + majorIntervals[indexval]

		sampler.triggerAttackRelease([allNotes[baseIndex],allNotes[topIndex]], sustain)


		bleInstance.requestSetChannelGainUpdate(haptic1,haptic1);
		var delayInMilliseconds = 300; //0.1 second
		setTimeout(function() {
			let haptic2 = haptic1-indexval;
			console.log(haptic2);
			bleInstance.requestSetChannelGainUpdate(haptic2,haptic2);
			}, delayInMilliseconds);


		guesses.textContent = ''
    }

	function randomInterval(min, max) { 
 		return Math.floor(Math.random() * (max - min + 1) + min)
	}

	function checkNote(e) {
		setSettings();

		const keynumber = Number(e.code.match(regex))
		const indexval = keynumber - 1

		if (indexval === testNote){
			document.body.style.background = "#2a9d8f";
			sampler.triggerAttackRelease([allNotes[baseIndex], allNotes[baseIndex + majorIntervals[indexval]]], sustain)

			//Streak
			streakCounter++
			streak.textContent = streakCounter;
			
			//Generate new note
			console.log("Correct")

			baseIndex = baseIndex + majorIntervals[indexval]

			if (fixedC == 1){
				baseIndex = 24
			}

			testNote = randomInterval(0, 7)
			setTimeout(() => { setNote(testNote) }, trialDelay);
		}

		else{
			if (indexval > 0){
			document.body.style.background = "#e76f51";
			guesses.textContent += indexval
			streakCounter = 0
			streak.textContent = streakCounter;
			sampler.triggerAttackRelease([allNotes[baseIndex], allNotes[baseIndex + majorIntervals[indexval]]], sustain)
			}
			//console.log(keyinput)
		}
	}