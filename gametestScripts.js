// Scripted By Adam Khoury in connection with the following video tutorial:
// http://www.youtube.com/watch?v=c_ohDPWmsM0

//wordings
let word_list = ['Obinrin','Okunrin','Keke','Aago','Orile-Ede','Ijoko','Ounje','Ile','Omode','Tabili'];

//pictures
let myPicturesDict = {
	0:['gameimg/woman.jpg', 'Obinrin'],
	1:['gameimg/man.jpg', 'Okunrin'],
 	2:['gameimg/bicycle.jpg', 'Keke'],
	3:['gameimg/clock.jpg', 'Aago'],
	4:['gameimg/country.jpg', 'Orile-Ede'],
	5:['gameimg/chair.jpg', 'Ijoko'],
	6:['gameimg/food.jpg', 'Ounje'],
	7:['gameimg/house.jpg', 'Ile'],
	8:['gameimg/children.jpg', 'Omode'],
	9:['gameimg/table.jpg', 'Tabili'],
};

let indexArray = [0,1,2,3,4,5,6,7,8,9];

let pictureOutput = '';
let wordButtonOutput = '';
let pictureIndex = [];
let wordingIndex = []
let gameLine = 0;
const scoreBoard = document.querySelector('.controls .score span');
let word_Attempts = new Map();
let modal = document.getElementById('popup1');
let closeicon = document.querySelector('.close');
let timer;
let score;
let hasStartedgame = false;
let timerValue;
let sec = 0;

//Total Attempts
//Total Time of play
//Logging of information
//Testing of Players



function pad ( val ) { return val > 9 ? val : "0" + val; }
function startTimer(){
    	timer = setInterval( function(){
    		let minutes = pad(parseInt(sec/60,10));
    		let seconds = pad(++sec%60);
    		timerValue = `${minutes} minutes ${seconds} seconds`;
        // document.getElementById("seconds").innerHTML=pad(++sec%60);
        // document.getElementById("minutes").innerHTML=pad(parseInt(sec/60,10));
    }, 1000);
    }

function checkGameStart(){
		if (hasStartedgame){
		startTimer();
	}
}

function getRandomInt(high, low) {
  //return Math.floor(Math.random() * Math.floor(max));
  let r = Math.floor(Math.random() * (high - low + 1)) + low;
  return r;
}

//Creating Random Game Picture Index
(function newRandom(){
	let num, already = new Object;

let start = 0, end = 9;

for (let i = 0; i < 5;)
{
    num = Math.floor(Math.random() * (end - start + 1)) + start;
    if (!(num in already))
    {
        already[num] = num;
        pictureIndex.push(num);
        i++;
    }
}
})();

//console.log(pictureIndex);
pictureIndex.forEach(value =>{
		wordingIndex.push(value);
	});

function setupGame(){
	scoreBoard.textContent = 0;
	score = 0;
	wordingIndex.shuffle();
	//console.log(wordingIndex);
    //indexArray.shuffle();
	for(let i = 0; i < 5; i++){
		//random = getRandomInt(10);
		//console.log(random);
		values = word_list[wordingIndex[i]];
		// bg = myPictures[pictureIndex[i]];
		bg = myPicturesDict[pictureIndex[i]][0];

		//output += '<div id="tile_'+i+'" onclick="memoryFlipTile(this,\''+word_list[i]+'\')"></div>';
		//output += '<div id="tile_'+i+'" onclick="memoryFlipTile(this,\''+word_list[i]+'\')"></div>';
		
		pictureOutput += `<div id="tile_${i}" style ="background:url('${bg}');background-size:100% 100%"></div>`+'\n';
		wordButtonOutput += `<button class = "gamebutton" id="button_${i}" name="gamebutton" onclick="buttonClick(this)" value="${values}">${values}</button>`+'\n';	
	}
	// console.log(pictureOutput + '\n' + wordButtonOutput);
	document.getElementById('memory_board').innerHTML = pictureOutput;
	document.getElementById('words_button').innerHTML = wordButtonOutput;
}


function buttonClick(thisButton){
	let counter = 0;
	if(thisButton.value == myPicturesDict[pictureIndex[gameLine]][1]){
		const picture = document.getElementById(`tile_${gameLine}`);
		picture.style.backgroundImage = `url('img/angular.svg')`;
		console.log('You are correct');
		hasStartedgame = true;
		checkGameStart();

		//If word has been seen before (attempted at least once)
		if(word_Attempts.has(thisButton.value)){
			counter = word_Attempts.get(thisButton.value);
			counter++;
			word_Attempts.set(thisButton.value, counter);
			score += 0.5;
			scoreBoard.textContent = score;
		}
		//If this is the first attempt at the word
		else{
			counter++;
			word_Attempts.set(thisButton.value, counter);
			score += 2;
			scoreBoard.textContent = score;
		}

		//When test is completed
		if (gameLine == 4){
			clearInterval(timer);
			console.log('End of game');
			disableGameButtons();
			closeGame();
			console.log(timerValue);

			localStorage.setItem('TIMESPENT_test', timerValue);
			localStorage.setItem('SCORE_test', score);

			//let iterator1 = word_Attempts[Symbol.iterator]();
			let iterator1 = word_Attempts.keys();
			for(let item of iterator1){
			console.log(item, word_Attempts.get(item));
			//let testName = 'test_' + item;
			localStorage.setItem(`test_${item}`, word_Attempts.get(item));
			}
		}
		else{
			gameLine++;
		}
		
	}
	else{
		hasStartedgame = true;
		checkGameStart();
		console.log('Try again!');
		if(word_Attempts.has(thisButton.value)){
			counter = word_Attempts.get(thisButton.value);
			counter++;
			word_Attempts.set(thisButton.value, counter);
		}
		else{
			counter++;
			word_Attempts.set(thisButton.value, counter);
		}
	}


	/*let iterator1 = word_Attempts[Symbol.iterator]();

	for(let item of iterator1){
	console.log(item);
	}*/
}

function disableGameButtons(){
	let gamebuttons = document.querySelectorAll('.gamebutton');
	gamebuttons.forEach(buttons => {
		buttons.disabled = true;
	});
}

function closeGame(){
	modal.classList.add("show");
	closeModal();

}

function closeModal(){
    	closeicon.addEventListener("click", function(e){
        modal.classList.remove("show");
        window.open('index.html', '_self', false);
});
}



Array.prototype.shuffle = function(){
    let i = this.length, j, temp;
    while(--i > 0){
        j = Math.floor(Math.random() * (i+1));
        temp = this[j];
        this[j] = this[i];
        this[i] = temp;
    }
}

window.addEventListener("load", setupGame());


