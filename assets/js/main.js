(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var shuffle = require('shuffle-array');

var myOpenTrivia;

function openTrivia() {
    // DOM elements//
    console.log('openTrivia');
    this.signInButton = document.getElementById('login');
    this.signInButton.addEventListener('click', this.signIn.bind(this));
    this.initFirebase();
}

// inicializar firebase y los productos a usar//
openTrivia.prototype.initFirebase = function () {
    // productos de firebase//
    console.log('initFirebase');
    this.auth = firebase.auth();
    this.auth.onAuthStateChanged(this.onAuthStateChanged.bind(this));
};

openTrivia.prototype.signIn = function () {
    // se usa cuenta de google para acceder
    console.log('signIn');
    var provider = new firebase.auth.GoogleAuthProvider();
    this.auth.signInWithPopup(provider);
};

openTrivia.prototype.signOut = function () {
    // Sign out de Firebase.//
    console.log('signOut');
    this.auth.signOut();
    location.reload();
};

openTrivia.prototype.onAuthStateChanged = function (user) {
    console.log('onAuthStateChanged');
    if (user) { // si el usuario esta signed in//
        // se toma el su foto de perfil de google y su nombre//
        $('#loginContainer').addClass('hide');
        $('#quizContainer').removeClass('hide');
    } else { // si el usuario esta signed out//
        // location.reload();
        console.log('signed out');
        $('#quizContainer').addClass('hide');
        $('#loginContainer').removeClass('hide');        
    }
};

$(document).ready(function () {
    $('select').material_select();
    myOpenTrivia = new openTrivia();
});

$('#begin').click(function () {
    let type = $('#type').val();
    let dificulty = $('#dificulty').val();
    if (type === null || dificulty === null) {
        alert('You must choose type and dificulty of the Trivia Test')
    } else if (type === 'boolean') {
        let test = `https://opentdb.com/api.php?amount=10&category=9&difficulty=${dificulty}&type=${type}`;
        getTFQuiz(test);
    } else {
        let test = `https://opentdb.com/api.php?amount=10&category=9&difficulty=${dificulty}&type=${type}`;
        getTest(test);
    }

});

function getTest(test) {
    fetch(test)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            questions = data.results;
            quiz();
        })
}

function getTFQuiz(test) {
    fetch(test)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            questions = data.results;
            quizTF();
        })
}

let questions;
let numQuestion = 0;
let right = 0;
let finalAnswer = '';

function userAnswer(event) {    
    let label = $(this).prop("labels");
    let text = $(label).html();
    finalAnswer = text;
}

function quiz() {
    if (numQuestion === 10) {
        $('#quizContainer').empty();
        let msg = '';
        if (right >= 8) {
            msg = 'Congratulations!! We can tell you study a lot.'
        } else if (right > 4 && right < 8) {
            msg = 'Good Job! a bit more of study will get you to the top.'
        } else {
            msg = 'Aww, you need to study hard to be a Know-it-all.'
        }
        $('#quizContainer').append(
            `<img class="responsive-img" src="assets/img/logo.png" alt="">
            <h5>Results</h5>
            <h6> Right Answers: ${right} / 10 </h6>
            <h6>  ${msg} </h6>
            <a id="refresh" class="waves-effect waves-light btn col s4 offset-s4">Play Again</a>
            <a id="logout" class="waves-effect waves-light btn col s4 offset-s4">Logout</a>`
        );

        $('#refresh').click(function () {
            location.reload();
        });

        myOpenTrivia.signOutButton = document.getElementById('logout');
        myOpenTrivia.signOutButton.addEventListener('click', myOpenTrivia.signOut.bind(myOpenTrivia));
        return;
    }
    $('#quizContainer').empty();
    let answers = questions[numQuestion].incorrect_answers;
    let rightAns = questions[numQuestion].correct_answer;
    answers.push(rightAns);

    shuffle(answers);

    $('#quizContainer').append(
        `<h5> ${questions[numQuestion].question}</h5>
        <form id="formAnswers" action="#">
        <p>
        <input name="group1" type="radio" id="test1" />
        <label for="test1">${answers[0]}</label>
        </p>
        <p>
        <input name="group1" type="radio" id="test2" />
        <label for="test2">${answers[1]}</label>
        </p>
        <p>
        <input name="group1" type="radio" id="test3" />
        <label for="test3">${answers[2]}</label>
        </p>
        <p>
        <input name="group1" type="radio" id="test4" />
        <label for="test4">${answers[3]}</label>
        </p>
        <a id="next" type="submit" class="waves-effect waves-light btn col s4 offset-s4">Next</a>
        </form>`
    );

    $('#test1').focus(userAnswer);
    $('#test2').focus(userAnswer);
    $('#test3').focus(userAnswer);
    $('#test4').focus(userAnswer);

    $('#next').click(function (event) {
        event.preventDefault();

        if ($("input:radio[name='group1']").is(":checked") === false) {
            alert("Must select an option.");
            return;
        }
        
        if (finalAnswer === rightAns) {
            right++;
        }
        quiz();
    });

    numQuestion++;
}

function quizTF() {

    if (numQuestion === 10) {
        $('#quizContainer').empty();
        let msg = '';
        if (right >= 8) {
            msg = 'Congratulations!! We can tell you study a lot.'
        } else if (right > 4 && right < 8) {
            msg = 'Good Job! a bit more of study will get you to the top.'
        } else {
            msg = 'Aww, you need to study hard to be a Know-it-all.'
        }
        $('#quizContainer').append(
            `<img class="responsive-img" src="assets/img/logo.png" alt="">
            <h5>Results</h5>
            <h6> Right Answers: ${right} / 10 </h6>
            <h6>  ${msg} </h6>
            <a id="refresh" class="waves-effect waves-light btn col s4 offset-s4">Play Again</a>
            <a id="logout" class="waves-effect waves-light btn col s4 offset-s4">Logout</a>`
        );

        $('#refresh').click(function () {
            location.reload();
        });
        myOpenTrivia.signOutButton = document.getElementById('logout');
        myOpenTrivia.signOutButton.addEventListener('click', myOpenTrivia.signOut.bind(myOpenTrivia));
    
        return
    }

    $('#quizContainer').empty();
    let rightAns = questions[numQuestion].correct_answer;


    $('#quizContainer').append(
        `<h5> ${questions[numQuestion].question}</h5>
        <form id="formAnswers" action="#">
        <p>
        <input name="group1" type="radio" id="test1" />
        <label for="test1">True</label>
        </p>
        <p>
        <input name="group1" type="radio" id="test2" />
        <label for="test2">False</label>
        </p>
        <a id="next" type="submit" class="waves-effect waves-light btn col s4 offset-s4">Next</a>
        </form>`
    );

    $('#next').click(function (event) {
        event.preventDefault();

        if ($("input:radio[name='group1']").is(":checked") === false) {
            alert("Must select an option.");
            return;
        }
        
        if (finalAnswer === rightAns) {
            right++;
        }
        quizTF();
    });

    $('#test1').focus(userAnswer);
    $('#test2').focus(userAnswer);
    numQuestion++;
}




},{"shuffle-array":2}],2:[function(require,module,exports){
'use strict';

/**
 * Randomize the order of the elements in a given array.
 * @param {Array} arr - The given array.
 * @param {Object} [options] - Optional configuration options.
 * @param {Boolean} [options.copy] - Sets if should return a shuffled copy of the given array. By default it's a falsy value.
 * @param {Function} [options.rng] - Specifies a custom random number generator.
 * @returns {Array}
 */
function shuffle(arr, options) {

  if (!Array.isArray(arr)) {
    throw new Error('shuffle expect an array as parameter.');
  }

  options = options || {};

  var collection = arr,
      len = arr.length,
      rng = options.rng || Math.random,
      random,
      temp;

  if (options.copy === true) {
    collection = arr.slice();
  }

  while (len) {
    random = Math.floor(rng() * len);
    len -= 1;
    temp = collection[len];
    collection[len] = collection[random];
    collection[random] = temp;
  }

  return collection;
};

/**
 * Pick one or more random elements from the given array.
 * @param {Array} arr - The given array.
 * @param {Object} [options] - Optional configuration options.
 * @param {Number} [options.picks] - Specifies how many random elements you want to pick. By default it picks 1.
 * @param {Function} [options.rng] - Specifies a custom random number generator.
 * @returns {Object}
 */
shuffle.pick = function(arr, options) {

  if (!Array.isArray(arr)) {
    throw new Error('shuffle.pick() expect an array as parameter.');
  }

  options = options || {};

  var rng = options.rng || Math.random,
      picks = options.picks || 1;

  if (typeof picks === 'number' && picks !== 1) {
    var len = arr.length,
        collection = arr.slice(),
        random = [],
        index;

    while (picks && len) {
      index = Math.floor(rng() * len);
      random.push(collection[index]);
      collection.splice(index, 1);
      len -= 1;
      picks -= 1;
    }

    return random;
  }

  return arr[Math.floor(rng() * arr.length)];
};

/**
 * Expose
 */
module.exports = shuffle;

},{}]},{},[1]);
