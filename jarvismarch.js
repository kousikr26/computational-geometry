
var jarvisMarchCanvas = new Two(params).appendTo(document.getElementById('jarvismarch'));
var jarvisMarchContext={}
jarvisMarchContext.points = [];
jarvisMarchContext.coords = [];
jarvisMarchContext.NUM_POINTS = 50;
jarvisMarchContext.drawInterval = 500;
jarvisMarchContext.redrawInterval = 2000;
jarvisMarchContext.mode="normal";
jarvisMarchContext.executingAlgo = false;
jarvisMarchContext.stopExecution = false;
jarvisMarchContext.firstTime = true;
jarvisMarchContext.tempDelay = 10;
jarvisMarchContext.buttonName = "executeJarvisMarch";

jarvisMarchContext.algo = jarvisMarch;
jarvisMarchContext.controls = document.querySelector("#jarvisMarchControls");
jarvisMarchContext.slider = new Slider("#jarvisMarchControls #numPointsSlider");
jarvisMarchContext.speedslider = new Slider("#jarvisMarchControls #speedSlider");
jarvisMarchContext.rectButton = jarvisMarchContext.controls.querySelector("#dropdownRectangular");
jarvisMarchContext.spherButton = jarvisMarchContext.controls.querySelector("#dropdownSpherical");
jarvisMarchContext.ellipButton = jarvisMarchContext.controls.querySelector("#dropdownElliptical");
initialisePoints(jarvisMarchCanvas,jarvisMarchContext);
function jarvisMarch(){
	
	var lowestPoint = 0;
	for (var i = 1; i < jarvisMarchContext.NUM_POINTS; i++) {
		if (jarvisMarchContext.coords[i][1] > jarvisMarchContext.coords[lowestPoint][1]) {
			lowestPoint = i;
		}
	}
	jarvisMarchContext.points[lowestPoint].fill = "#ff0000";
	jarvisMarchContext.points[lowestPoint].radius = divsize * 2;
	
	var nextPoint;
	var currentPoint = lowestPoint;
	var hull = [];
	
	var tempLine;
	var tempLines = []
	var interval;
	var jarvisMarchStep = function () {

		nextPoint = (currentPoint + 1) % jarvisMarchContext.NUM_POINTS;
		for (var i = 0; i < jarvisMarchContext.NUM_POINTS; i++) {
			tempLine = drawDashedLine(jarvisMarchCanvas, jarvisMarchContext.coords[currentPoint], jarvisMarchContext.coords[i]);
			tempLines.push(tempLine);
			if (orientationPoints(jarvisMarchContext.coords[currentPoint], jarvisMarchContext.coords[i], jarvisMarchContext.coords[nextPoint]) == 1) {
				nextPoint = i;
			}
		}


		drawLine(jarvisMarchCanvas, jarvisMarchContext.coords[currentPoint], jarvisMarchContext.coords[nextPoint]);
		currentPoint = nextPoint;
		for (var j = 0; j < tempLines.length; j++) {
			tempLines[j].remove();
		}
		hull.push(currentPoint);
		if (nextPoint == lowestPoint) {
			clearTimeout(interval);
			jarvisMarchCanvas.update();
			if (!jarvisMarchContext.stopExecution) {
				var argumentsf=[];
				
				for(var k=0;k<hull.length;k++){
					argumentsf.push(jarvisMarchContext.coords[hull[k]][0], jarvisMarchContext.coords[hull[k]][1]);

				}
				argumentsf.push(false);
				
				var path = jarvisMarchCanvas.makePath(...argumentsf);
				path.linewidth = 4;
				path.fill = "#ff0000";
				path.opacity = 0.5;
				path.stroke="#000000";
				jarvisMarchCanvas.update();
				
				setTimeout(function () {
					
					if(!jarvisMarchContext.stopExecution){
						jarvisMarchCanvas.clear();
						initialisePoints(jarvisMarchCanvas, jarvisMarchContext);
						jarvisMarch();
					}
					else{
						executionComplete(jarvisMarchContext);
					}
						
					
					
				}, jarvisMarchContext.redrawInterval);
			}
			else {
				executionComplete(jarvisMarchContext);
			}
		}
		else{
			interval = setTimeout(jarvisMarchStep, jarvisMarchContext.drawInterval);
		}

	}


	interval = setTimeout(function () {
		jarvisMarchStep();
		
		

	}, jarvisMarchContext.drawInterval);

	jarvisMarchCanvas.update()

}


