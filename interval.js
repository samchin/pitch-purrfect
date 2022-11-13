

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
	//   C3: "C3.mp3",
	//   "D#3": "Ds3.mp3",
	//   "F#3": "Fs3.mp3",
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
	const notes = ["NULL", "C4", "D4", "E4", "F4", "G4", "A5", "B5", "C5"]
	const allKeys = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"]

	window.addEventListener('keydown', checkNote);

	let keySignature = "C";

	let sustain = 1;
	let trialDelay = 1500;
	let sensoryDelay = 200;
	let intranoteDelay = 0;

	let streakCounter = 0;
	let testNote = randomInterval(1, 8);

	function initialize(e){
		testNote = randomInterval(1, 8)
		setTimeout(() => { setNote(testNote) }, 100)
		}

	streak.textContent += streakCounter;
	prompt.textContent += testNote

	function setSettings(e){
		sustain = $('#Sustain').val();
		trialDelay = $('#trialDelay').val();
		sensoryDelay = $('#sensoryDelay').val();
		intranoteDelay = $('#intranoteDelay').val();
	}

	function setNote(interval) {
		setSettings();
		document.body.style.background = "white";
		testNote = interval
		prompt.textContent = interval
		sampler.triggerAttackRelease([notes[1],notes[interval]], sustain)

		//console.log(testNote)
		guesses.textContent = ''
    }

	function randomInterval(min, max) { 
 		return Math.floor(Math.random() * (max - min + 1) + min)
	}

	function playNotes(note1, note2){
		if (intranoteDelay = 0) {
			sampler.triggerAttackRelease([note1, note2], sustain)
		}
		if (intranoteDelay > 0) {
			setTimeout(() => {sampler.triggerAttackRelease([note1], sustain)}, intranoteDelay);
			sampler.triggerAttackRelease([note2], sustain)
		}

	}


	function checkNote(e) {
		setSettings();

		const keyinput = Number(e.code.match(regex))

		if (keyinput === testNote){
			document.body.style.background = "#2a9d8f";
			sampler.triggerAttackRelease([notes[1],notes[keyinput]], sustain)

			//playNotes(notes[1], notes[keyinput]);
			//Streak
			streakCounter++
			streak.textContent = streakCounter;
			
			//Generate new note
			console.log("Correct")
			newNote = randomInterval(1, 8)
			setTimeout(() => { setNote(newNote) }, trialDelay);
		}
		else{
			if (keyinput > 0){
			document.body.style.background = "#e76f51";
			guesses.textContent += keyinput
			streakCounter = 0
			streak.textContent = streakCounter;
			sampler.triggerAttackRelease([notes[1],notes[keyinput]], sustain)
			}
			//console.log(keyinput)
		}
	}
