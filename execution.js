
function executeAlgo(canvas,context){
    if (!context.executingAlgo) {
        context.executingAlgo = true;
        context.stopExecution = false;
        if (!context.firstTime) {
            canvas.clear();
            initialisePoints(canvas, context);
        }
        disableStuff(context);
        context.algo();
        context.firstTime = false;

    }
    else {
        context.stopExecution = true;
        context.executingAlgo = false;
        context.tempDelay = context.drawInterval;
        context.drawInterval = 10;

    }
    var button = document.getElementById(context.buttonName);
    if (button.innerHTML == "Execute") {
        button.innerHTML = "Halt";
        button.classList.remove("btn-success");
        button.classList.add("btn-danger");
    }
    else {
        button.innerHTML = "<span class=\"spinner-grow spinner-grow-sm\" role=\"status\" aria-hidden=\"true\"></span> Halting..."

    }
}

function executionComplete(context){
    context.drawInterval=context.tempDelay;
    var button = document.getElementById(context.buttonName);
    button.innerHTML = "Execute";
    button.classList.remove("btn-danger");
    button.classList.add("btn-success");
    enableStuff(context);
}

contexts = {"jarvisMarch":jarvisMarchContext,"quickHull":quickHullContext};
canvases = {"jarvisMarch":jarvisMarchCanvas,"quickHull":quickHullCanvas};



function dropdownRectangular(algo){
    var button=document.querySelector("#"+algo+"Controls #dropdownButton");
    context = contexts[algo];
    canvas = canvases[algo];
    context.mode = "normal";
    button.innerHTML = "Rectangular";
    canvas.clear()
    context.firstTime=true;
    initialisePoints(canvas,context);
}


function dropdownSpherical(algo) {
    var button = document.querySelector("#" + algo + "Controls #dropdownButton");
    context = contexts[algo];
    canvas = canvases[algo];
    context.mode = "circular";
    button.innerHTML = "Circular";
    canvas.clear()
    context.firstTime = true;
    initialisePoints(canvas, context);
}
function dropdownElliptical(algo) {
    var button = document.querySelector("#" + algo + "Controls #dropdownButton");
    context = contexts[algo];
    canvas = canvases[algo];
    context.mode = "elliptical";
    button.innerHTML = "Elliptical";
    canvas.clear()
    context.firstTime = true;
    initialisePoints(canvas, context);
}
function disableStuff(context){
    context.slider.disable();
    context.rectButton.classList.add("disabled");
    context.spherButton.classList.add("disabled");
    context.ellipButton.classList.add("disabled");
} 
function enableStuff(context) {
    context.slider.enable();
    context.rectButton.classList.remove("disabled");
    context.spherButton.classList.remove("disabled");
    context.ellipButton.classList.remove("disabled");
}


jarvisMarchContext.slider.on("slide", function (sliderValue) {
    jarvisMarchContext.controls.querySelector("#numPointsSliderVal").textContent = sliderValue;
    jarvisMarchContext.NUM_POINTS = sliderValue;
    jarvisMarchCanvas.clear();
    initialisePoints(jarvisMarchCanvas, jarvisMarchContext);
    jarvisMarchContext.firstTime = true;
});


jarvisMarchContext.speedslider.on("slide", function (sliderValue) {
    jarvisMarchContext.controls.querySelector("#speedSliderVal").textContent = sliderValue;
    var newVal = 10 / sliderValue;
    jarvisMarchContext.drawInterval = newVal * newVal * 50;

});


quickHullContext.slider.on("slide", function (sliderValue) {
    quickHullContext.controls.querySelector("#numPointsSliderVal").textContent = sliderValue;
    quickHullContext.NUM_POINTS = sliderValue;
    quickHullCanvas.clear();
    initialisePoints(quickHullCanvas, quickHullContext);
    quickHullContext.firstTime = true;
});


quickHullContext.speedslider.on("slide", function (sliderValue) {
    quickHullContext.controls.querySelector("#speedSliderVal").textContent = sliderValue;
    var newVal = 10 / sliderValue;
    quickHullContext.drawInterval = newVal * newVal * 50;

});
function executeJarvisMarch() {
    executeAlgo(jarvisMarchCanvas, jarvisMarchContext);
}
function executeQuickHull() {
    executeAlgo(quickHullCanvas, quickHullContext);
}