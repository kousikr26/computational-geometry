var quickHullCanvas = new Two(params).appendTo(document.getElementById('quickhull'));
quickHullContext = {}
quickHullContext.points = [];
quickHullContext.coords = [];
quickHullContext.NUM_POINTS = 50;
quickHullContext.drawInterval = 1000;
quickHullContext.redrawInterval = 3000;
quickHullContext.mode = "normal";
quickHullContext.executingAlgo = false;
quickHullContext.stopExecution = false;
quickHullContext.firstTime = true;
quickHullContext.tempDelay = 10;
quickHullContext.buttonName = "executeQuickHull";

quickHullContext.algo = quickHull;
quickHullContext.controls = document.querySelector("#quickHullControls");
quickHullContext.slider = new Slider("#quickHullControls #numPointsSlider");
quickHullContext.speedslider = new Slider("#quickHullControls #speedSlider");
quickHullContext.rectButton = quickHullContext.controls.querySelector("#dropdownRectangular");
quickHullContext.spherButton = quickHullContext.controls.querySelector("#dropdownSpherical");
quickHullContext.ellipButton = quickHullContext.controls.querySelector("#dropdownElliptical");

initialisePoints(quickHullCanvas, quickHullContext);
function quickHull() {

    
    var hull = [];
    var leftPoint = 0;
    var rightPoint = 0;
    for (var i = 1; i < quickHullContext.NUM_POINTS; i++) {
        if (quickHullContext.coords[i][0] > quickHullContext.coords[rightPoint][0]) {
            rightPoint = i;
        }
        if (quickHullContext.coords[i][0] < quickHullContext.coords[leftPoint][0]) {
            leftPoint = i;
        }
    }

    highlightPoint(quickHullContext.points[leftPoint]);
    highlightPoint(quickHullContext.points[rightPoint]);
    initialPartitionLine = drawLine(quickHullCanvas, quickHullContext.coords[leftPoint], quickHullContext.coords[rightPoint]);
    quickHullCanvas.update();
    perpendiculars = []
    
    var active =0;
    
    var temphull;
    var quickHullStep = function (partitionLine,side) {
        
       
        perpendiculars.push(partitionLine);
        
        var farthestPoint = -1;
        var maxDistance = 0;
        for(var i =0;i<quickHullContext.NUM_POINTS;i++){
            var orientation = orientationLinePoint(partitionLine, quickHullContext.coords[i]);
            
            if(orientation == side){
                perpendiculars.push(drawPerpendicular(quickHullCanvas, partitionLine, quickHullContext.coords[i]));
                var temp = lineDistance(partitionLine, quickHullContext.coords[i]);
                if(temp > maxDistance){
                    farthestPoint = i;
                    maxDistance = temp;
                }
            }
            
        }
        quickHullCanvas.update();
        var p = [partitionLine.vertices[0].x, partitionLine.vertices[0].y];
        var q = [partitionLine.vertices[1].x, partitionLine.vertices[1].y];
        if (farthestPoint == -1) {
            hull.push(p);
            hull.push(q);
            active -=1;
           
            return;
        }
       
        highlightPoint(quickHullContext.points[farthestPoint]);
       
       
        
       
        var line1 = drawLine(quickHullCanvas,quickHullContext.coords[farthestPoint],p);
        var line2 = drawLine(quickHullCanvas, quickHullContext.coords[farthestPoint], q);
        
        
        
        
        active += 1;
        setTimeout(quickHullStep, quickHullContext.drawInterval, line1, -orientationLinePoint(line1,q));
        setTimeout(quickHullStep, quickHullContext.drawInterval, line2, -orientationLinePoint(line2, p));
        setTimeout(function(){
            for (var j = 0; j < perpendiculars.length; j++) {
                perpendiculars[j].remove();
            }
        },quickHullContext.drawInterval);
        

        if (temphull)
            temphull.remove();
        temphull = drawHull(hull);

    }
    active += 2;
    timeout = setTimeout(function () {
        
        quickHullStep(initialPartitionLine,1);
        quickHullStep(initialPartitionLine, -1);
        

    }, quickHullContext.drawInterval);
    
    quickHullCanvas.update();
    
    interval = setInterval(function(){
        
        if(active ==0){
            if(temphull)
                temphull.remove();
            drawHull(hull);
            
            if (!quickHullContext.stopExecution) {
               

                setTimeout(function () {

                    if (!quickHullContext.stopExecution) {
                        quickHullCanvas.clear();
                        initialisePoints(quickHullCanvas, quickHullContext);
                        quickHull();
                    }
                    else {
                        executionComplete(quickHullContext);
                    }



                }, quickHullContext.redrawInterval);
            }
            else {
                executionComplete(quickHullContext);
            }
            clearInterval(interval);
        }
        
    },100);
    
}

function drawHull(hull){

    var centerx = 0;
    var centery = 0;
    const map = new Map();
    hull.forEach((item) => map.set(item.join(), item));
    hull = Array.from(map.values());
    for (var i = 0; i < hull.length; i++) {
        centerx += hull[i][0]
        centery += hull[i][1]
    }
    center = [centerx / hull.length, centery / hull.length];




    hull.sort(function pointComparison(a, b) {
        if (Math.atan2(b[1] - center[1], b[0] - center[0]) < Math.atan2(a[1] - center[1], a[0] - center[0])) {
            return -1;
        }
        if (Math.atan2(b[1] - center[1], b[0] - center[0]) < Math.atan2(a[1] - center[1], a[0] - center[0])) {
            return 1;
        }
        return 0;
    });

    var argumentsf = [];

    for (var k = 0; k < hull.length; k++) {
        argumentsf.push(hull[k][0]);
        argumentsf.push(hull[k][1]);

    }
    argumentsf.push(false);

    var path = quickHullCanvas.makePath(...argumentsf);
    path.linewidth = 4;
    path.fill = "#ff0000";
    path.opacity = 0.5;
    path.stroke = "#000000";
    quickHullCanvas.update();
    return path;
}