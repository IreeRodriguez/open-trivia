(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// Variables globales:
let shuffle = require('shuffle-array');
let myOpenTrivia = null;
let quizData = {
    type: '',
    questions: [],
    choices: [],
    rightAnswer: '', 
    questionCount: 0,
    rightCount: 0,
    currentChoice: '', 
    update: function() {
        if (this.questionCount < this.questions.length) {
            const currentQuestion = this.questions[this.questionCount];

            if (this.type === 'boolean') {
                this.choices = ['True', 'False'];
            } else {
                this.choices = currentQuestion.incorrect_answers;
                this.choices.push(currentQuestion.correct_answer);  
                shuffle(this.choices);
            }
            this.rightAnswer = currentQuestion.correct_answer;  
        } else {
            type = '';
            questions = [];
            choices = [];
            rightAnswer = '';
            questionCount = 0;
            rightCount = 0;
            currentChoice = '';
        }
    }
};

function openTrivia() {
    // DOM elements//
    this.signInButton = document.getElementById('login');
    this.signInButton.addEventListener('click', this.signIn.bind(this));
    this.initFirebase();
}

// inicializar firebase y los productos a usar//
openTrivia.prototype.initFirebase = function () {
    // productos de firebase//
    this.auth = firebase.auth();
    this.auth.onAuthStateChanged(this.onAuthStateChanged.bind(this));
};

openTrivia.prototype.signIn = function () {
    // se usa cuenta de google para acceder
    var provider = new firebase.auth.GoogleAuthProvider();
    this.auth.signInWithPopup(provider);
};

openTrivia.prototype.signOut = function () {
    // Sign out de Firebase.//
    this.auth.signOut();
    location.reload();
};

openTrivia.prototype.onAuthStateChanged = function (user) {
    if (user) { // si el usuario esta signed in//
        // se toma el su foto de perfil de google y su nombre//
        $('#loginContainer').addClass('hide');
        $('#quizContainer').removeClass('hide');
    } else { // si el usuario esta signed out//
        // location.reload();
        $('#quizContainer').addClass('hide');
        $('#loginContainer').removeClass('hide');        
    }
};

$(document).ready(function () {
    $('select').material_select();
    myOpenTrivia = new openTrivia();
});

$('#begin').click(function () {
    const type = $('#type').val();
    const difficulty = $('#difficulty').val();
    getTest(type, difficulty);
});

function getTest(type, difficulty) {
    if (type === null || difficulty === null) {
        alert('You must choose type and difficulty of the Trivia Test');
        return;
    }     
    const url = `https://opentdb.com/api.php?amount=10&category=9&difficulty=${difficulty}&type=${type}`;

    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            if (data.results.length === 0) {
                alert('Under construction');
                //location.reload();
            } else {            
                quizData.type = type;
                quizData.questions = data.results;
                quizData.update();        
                runQuiz();
            }
        });
}

function createNextBtn() {
    $('#quizContainer > #formAnswers').after(
        `<a id="next" type="submit" class="waves-effect waves-light btn col s4 offset-s4">Next</a>`
    )
    $('#next').click(function (event) {
        event.preventDefault();

        if ($("input:radio[name='group1']").is(":checked") === false) {
            alert("Must select an option.");
            return;
        }

        if (quizData.currentChoice === quizData.rightAnswer) {
            quizData.rightCount++;
        }

        quizData.update();
        runQuiz();
    });
}

function runQuiz() {
    if (quizData.questionCount === 10) {
        $('#quizContainer').empty();
        let msg = '';
        if (quizData.rightCount >= 8) {
            msg = 'Congratulations!! We can tell you study a lot.'
        } else if (quizData.rightCount > 4 && quizData.rightCount < 8) {
            msg = 'Good Job! a bit more of study will get you to the top.'
        } else {
            msg = 'Aww, you need to study hard to be a Know-it-all.'
        }
        $('#quizContainer').append(
            `<img class="responsive-img" src="assets/img/logo.png" alt="">
            <h5>Results</h5>
            <h6> Right Answers: ${quizData.rightCount} / 10 </h6>
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

    $('#quizContainer').append(
        `<h5> ${quizData.questions[quizData.questionCount].question}</h5>
        <form id="formAnswers" action="#">
        </form>`
    );
    
    for (i in quizData.choices) {
        $('#quizContainer > #formAnswers').append(
            `<p>
            <input name="group1" type="radio" id="test${i + 1}" />
            <label for="test${i + 1}">${quizData.choices[i]}</label>
            </p>`
        );
        $(`#test${i + 1}`).focus(function (event) {    
            const label = $(this).prop("labels");
            quizData.currentChoice = $(label).html();
        });
    }
    createNextBtn();
    quizData.questionCount++;    
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
