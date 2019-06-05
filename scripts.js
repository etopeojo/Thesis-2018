const cards = document.querySelectorAll(".memory-card");

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let developermode = true;
let timerCount = document.querySelector('.timer');
const timeForGame = 1200; //300 seconds === 5 minutes
let timer;
let secsLeft;
let moves = 0;
let totalTimePlayed = 0;

let modal = document.getElementById('popup1');
let totalTime = document.getElementById('totalTime');
let finalMove = document.getElementById('finalMove');
let closeicon = document.querySelector('.close');

let openedCards = [];

let word_list = ['Obinrin','Okunrin','Keke','Aago','Orile-Ede','Ijoko','Ounje','Ile','Omode','Tabili'];
let word_LogCount = new Map();


// DEVELOPER MODE TO SHOW ALL CARDS AT ONCE
(function allflip(){
	if(developermode){
		cards.forEach(card =>{
			card.classList.add('flip');
		});

		moves = 45;
		totalTimePlayed = 86;
		congratulations(totalTimePlayed);
		developWordCount();
	}
})();


/*FlipCard*/
function flipCard(){
	if(lockBoard) return;

	if(this === firstCard) return;

	this.classList.add('flip');

	if(!hasFlippedCard){
		hasFlippedCard = true;
		firstCard = this;
		moveCounter();
		return;
	}

	
	secondCard = this;
	//hasFlippedCard = false;

	moveCounter();
	checkForMatch();
}

function checkForMatch(){
	let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;
	if(isMatch){
		openedCards.push(firstCard);
		openedCards.push(secondCard);
		firstCard.dataset.logcount++;
		secondCard.dataset.logcount++;
		disableCards();
		if(openedCards.length === cards.length){
			clearInterval(timer);
			totalTimePlayed = timeForGame - secsLeft;
			displayTimeLeft(timeForGame - secsLeft)
			//console.log(totalTimePlayed);
			congratulations(totalTimePlayed);
			developWordCount();
		}
	} else{
		firstCard.dataset.logcount++;
		secondCard.dataset.logcount++;
		unFlipCards();
	}

}

function developWordCount(){
	/*word_list.forEach(words => {
		word_LogCount.set(words,0);
	});
*/
	/*cards.forEach(cards => {
		word_LogCount.set(cards.dataset.wordtranslate, 2);
	});*/

	for(let i = 0; i < cards.length; i+=2){
		let count = Number.parseInt(cards[i].dataset.logcount,10) + Number.parseInt(cards[i+1].dataset.logcount,10);
		word_LogCount.set(cards[i].dataset.wordtranslate, count);
	}

	/*cards.forEach(cards => {
		console.log(`${cards.dataset.framework} = ${cards.dataset.logcount}`);
	});*/


	localStorage.setItem('TIMESPENT_game', totalTimePlayed);
	localStorage.setItem('MOVES_game', moves);
	//let iterator1 = word_LogCount[Symbol.iterator]();
	let iterator1 = word_LogCount.keys();
	for(let item of iterator1){
		console.log(item,word_LogCount.get(item));
		localStorage.setItem(`game_${item}`,word_LogCount.get(item));
	}
}

function disableCards(){
	firstCard.removeEventListener('click', flipCard);
	secondCard.removeEventListener('click', flipCard);

	resetBoard();
}

function unFlipCards(){
	lockBoard = true;

	setTimeout(() =>{
		firstCard.classList.remove('flip');
		secondCard.classList.remove('flip');
		resetBoard();
	}, 1000);
}

function resetBoard(){
	[hasFlippedCard, lockBoard] = [false, false];
	[firstCard, secondCard] = [null, null];
}

(function shuffle(){
	cards.forEach(card => {
		let randomPos = Math.floor(Math.random() * 12);
		card.style.order = randomPos;
	})
})();



function downTimer(seconds){
	clearInterval(timer);

	let now = Date.now(),
		then = now + (seconds * 1000);

		displayTimeLeft(seconds);

		timer = setInterval(() => {
			secsLeft = Math.round((then - Date.now()) / 1000);

			if(secsLeft < 0){
				clearInterval(timer);
				return;
			}

			displayTimeLeft(secsLeft);
		}, 1000);
}

function displayTimeLeft(secsLeft){
	let minutes = Math.floor(secsLeft / 60),
		secs = secsLeft % 60;

		timerCount.textContent = `${formatTime(minutes)}:${formatTime(secs)}`;
		// console.log(`${formatTime(minutes)}:${formatTime(secs)}`);
}

function formatTime(time){
	return `${time < 10 ? '0' : ''}${time}`;
}


function moveCounter(){
    moves++;
    //start timer on first click
    if(moves === 2) downTimer(timeForGame);
}


// @description congratulations when all cards match, show modal and moves, time and rating
function congratulations(playingTime){
    // if (matchedCard.length == 16){
    //     clearInterval(interval);
    //     finalTime = timer.innerHTML;

        // show congratulations modal
        modal.classList.add("show");

        if(developermode){
        	let minutes = Math.floor((playingTime) / 60),
			secs = 40 % 60;
        	totalTime.textContent = `${formatTime(minutes)} minutes : ${formatTime(secs)} seconds`;
        	totalTimePlayed = `${formatTime(minutes)} minutes ${formatTime(secs)} seconds`;
        }
        else{
        	let minutes = Math.floor((playingTime) / 60),
			secs = playingTime % 60;
        	totalTime.textContent = `${formatTime(minutes)} minutes : ${formatTime(secs)} seconds`;
        	totalTimePlayed = `${formatTime(minutes)} minutes ${formatTime(secs)} seconds`;
        }

        finalMove.textContent = `${moves}`;
        /*// declare star rating variable
        var starRating = document.querySelector(".stars").innerHTML;

		
        //showing move, rating, time on modal
        document.getElementById("finalMove").innerHTML = moves;
        document.getElementById("starRating").innerHTML = starRating;
        document.getElementById("totalTime").innerHTML = finalTime;

        //closeicon on modal*/
        //closeModal();
    // };
}

/*function closeModal(){
    	closeicon.addEventListener("click", function(e){
        modal.classList.remove("show");
        window.location.reload();
    });
}*/
function linktoTest(){
	window.open('gametest.html', '_self', false);
}


window.addEventListener('load',displayTimeLeft(timeForGame));
cards.forEach(card => card.addEventListener('click',flipCard));



