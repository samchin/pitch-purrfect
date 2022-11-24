
// reference: https://www.youtube.com/watch?v=VPI27L_fQC4&list=PLRmEk9smitaVGAAhgU0Pdc2sEs7yxDrEk&index=1&ab_channel=Get__itDone%21

function postData(e){
	const url = "https://script.google.com/macros/s/AKfycbxBHNTOJDlkwFXMsDUh8SWfzXVGN-wRyJgP3HWTm4iueAIxQA8gE5Scq92IxSZ3Zkv5/exec";

	//get timestamp
	const d = new Date();
	let ts = d.toJSON();
	console.log(ts);

	//get keypress number
	const keynumber = Number(e.code.match(regex))
	let key = keynumber.toString();
	console.log(key);

	fetch(url,{
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'no-cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    headers: {
      'Content-Type': 'application/json'
    },
    redirect: 'follow', // manual, *follow, error
    body: JSON.stringify({timestamp: ts,keypress:key}) // body data type must match "Content-Type" header
  });


 

}

window.addEventListener('keypress', postData);



