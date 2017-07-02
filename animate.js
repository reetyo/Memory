var c = document.getElementById("myCanvas");
var stage;
var wordArray = new Array;
var explainationArray = new Array;
var verticalOffset = 100;
var numberOfLines = 5;
var h = 1080//document.documentElement.clientHeight;
var w = 1920//document.documentElement.clientWidth;
var mainTimeLine = new createjs.Timeline();
var globalNumArray;
var globalFinishCount = 0;

const main = require('electron').remote.require('./main.js');


mainTimeLine.loop = true;

var flag = 0;
var finishCount = 0;

function resizeCanvas() {
    console.log(h);
    console.log(w);
    c.setAttribute('width', w);
    c.setAttribute('height', h);
    var cxt = c.getContext("2d");

};

function calculateWordYPositon(index) {
    var space = (h - 2 * verticalOffset) / (numberOfLines - 1);
    return verticalOffset + index * space;
}

function getWordContent() {
    var contentNumArray = new Array();
    var resultArray = new Array();
    for (var i = 0; i < numberOfLines; i++) {
        var num = Math.random() * storage.word.length;
        contentNumArray.push(Math.floor(num));
    }
    for (var i = 0; i < contentNumArray.length; i++) {
        resultArray.push((storage.word)[contentNumArray[i]]);
    }
    console.log(contentNumArray);
    return { result: resultArray, num: contentNumArray };
}

function strokeWord() {
    var contentArray = getWordContent().num
    for (var i = 0; i < contentArray.length; i++) {
        var text = new createjs.Text((storage.word)[contentArray[i]], "70px Arial", "#FFFFFF");
        text.x = 100;
        text.y = calculateWordYPositon(i);
        stage.addChild(text);
        wordArray.push(text);

        var translation = new createjs.Text((storage.translation)[contentArray[i]], "70px Arial", "#FFFFFF");
        translation.y = calculateWordYPositon(i);
        translation.x = w / 2;
        stage.addChild(translation);
        explainationArray.push(translation);
    }
    stage.update();
}


function moveWord() {
    for (var i = 0; i < wordArray.length; i++) {
        var word = wordArray[i];
        word.y += 100;
        word.alpha = 0;
        var currentTween = createjs.Tween.get(word).to({ alpha: 1, y: word.y - 100 }, 1000, createjs.Ease.getPowInOut(4))
            .wait(20000)
            .to({ alpha: 0, y: word.y - 200 }, 1000, createjs.Ease.getPowInOut(4))
            .call(handleComplete, [i]);
        mainTimeLine.addTween(currentTween);
    }

    for (var i = 0; i < explainationArray.length; i++) {
        var explaination = explainationArray[i];
        explaination.x += 200;
        explaination.alpha = 0;
        var currentTween = createjs.Tween.get(explaination)
            .wait(12000)
            .to({ alpha: 1, x: explaination.x - 200 }, 1000, createjs.Ease.getPowInOut(4))
            .wait(7000)
            .to({ alpha: 0, y: explaination.y - 200 }, 1000, createjs.Ease.getPowInOut(4))
        mainTimeLine.addTween(currentTween);
    }
}

function moveExplantation() {
    // for (var i = 0; i < explainationArray.length; i++) {
    //     var explaination = explainationArray[i];
    //     explaination.x += 200;
    //     explaination.alpha = 0;
    //     var currentTween = createjs.Tween.get(explaination)
    //     .wait(6500)
    //     .to({ alpha: 1, x: explaination.x - 200 }, 1000, createjs.Ease.getPowInOut(4))
    //     .wait(4500)
    //     .to({ alpha: 0, y: explaination.y - 200 }, 1000, createjs.Ease.getPowInOut(4))
    //         .call(handleExplainationComplete,[i]);
    //     mainTimeLine.addTween(currentTween);
    // }
}

function handleComplete(i) {
    globalFinishCount += 1;
    if (globalFinishCount == numberOfLines) {
        globalFinishCount = 0;
        for (var i = 0; i < numberOfLines; i++) {
            var num = getWordContent().num;
            wordArray[i].text = (storage.word)[num[i]];
            explainationArray[i].text = (storage.translation)[num[i]];
        }
    }
}


resizeCanvas();
stage = new createjs.Stage("myCanvas");
stage.canvas.style.backgroundColor = "#000000"
createjs.Ticker.setFPS(60);
createjs.Ticker.addEventListener("tick", stage);
var storage = main.getArrayContent()
strokeWord();
moveWord();
//moveExplantation();