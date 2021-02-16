var divsize = 5;
var marginY = 0.4 * window.innerHeight;
var marginX = 0.2 * window.innerWidth;
var params = { width: window.innerWidth, height: 0.7 * window.innerHeight };
function makePoint(canvas,context,mode="normal") {

    if(mode == "normal"){
        var color = "#000000"

        var posx = parseInt((marginX / 4.0 + Math.random() * (window.innerWidth - marginX)).toFixed());
        var posy = parseInt((marginY / 10.0 + Math.random() * (window.innerHeight - marginY)).toFixed());



        var circle = canvas.makeCircle(posx, posy, divsize);
        circle.fill = color;
        context.points.push(circle);
        context.coords.push([posx, posy]);
    }
    else if (mode=="circular"){
        var color = "#000000"
        var R = (window.innerHeight - marginY)/2.0;
        var r = R*Math.sqrt(Math.random());
        var theta = Math.random()*2*Math.PI;
        var posx = parseInt((marginX / 4.0 + (window.innerWidth - marginX) / 2.0 + r * Math.cos(theta)).toFixed());
        var posy = parseInt((marginX / 10.0 + (window.innerHeight - marginY) / 2.0 + r * Math.sin(theta)).toFixed());
        var circle = canvas.makeCircle(posx, posy, divsize);
        circle.fill = color;
        context.points.push(circle);
        context.coords.push([posx, posy]);
    }
    else if (mode == "elliptical") {
        var color = "#000000"
        var posx,posy,tempx,tempy;
        var a = (window.innerWidth - marginX) / 2.0;
        var b = (window.innerHeight - marginY) / 2.0;
        while(true){
            tempx = (2*Math.random()-1) * (window.innerWidth - marginX);
            tempy = (2*Math.random()-1) * (window.innerHeight - marginY);
            
            if (((tempx * tempx) / (a*a) )+ ((tempy * tempy) / (b*b)) <= 1 ){
                break;
            }
        }
        posx = parseInt((marginX / 4.0 +a+ tempx).toFixed());
        posy = parseInt((marginY / 10.0 +b+ tempy).toFixed());
        var circle = canvas.makeCircle(posx, posy, divsize);
        circle.fill = color;
        context.points.push(circle);
        context.coords.push([posx, posy]);
    }

}
function makeNPoints(n,canvas,context,mode="normal") {
    for (var i = 0; i < n; i++) {
        makePoint(canvas,context,mode);
    }
    canvas.update();
}
function initialisePoints(canvas, context) {
    context.points = []
    context.coords = []
    makeNPoints(context.NUM_POINTS, canvas, context, mode = context.mode);
}
function drawLine(canvas,point1,point2) {
    
    var line = canvas.makeLine(point1[0], point1[1], point2[0], point2[1]);
    line.linewidth = 3
    canvas.update();
    
    return line;
}
function drawDashedLine(canvas,point1, point2) {
    
    var line = canvas.makeLine(point1[0], point1[1], point2[0], point2[1]);
    line.linewidth = 1;
    line.stroke = "#ff0000";
    for (var i = 0; i < 10; i++) {
        var scalar = (i + 1) * 2;
        line.dashes[i] = 40 / scalar;

    }
    
    canvas.update();
    return line;
}

function orientationPoints(p, q, r) {
    
    var val = (q[1] - p[1]) * (r[0] - q[0]) - (q[0] - p[0]) * (r[1] - q[1]);

    if (val >= 0) return 0;
    return 1;
}
function orientationLinePoint(line, r) {
    var p = [line.vertices[0].x,line.vertices[0].y];
    var q = [line.vertices[1].x, line.vertices[1].y];
    var val = (r[1] - p[1]) * (q[0] - p[0]) - (q[1]- p[1]) * (r[0] - p[0]);

    if (val > 0) return 1;
    if(val < 0) return -1;
    return 0;
}
function drawPerpendicular(canvas,line,r,dashed = true){
    var p = [line.vertices[0].x, line.vertices[0].y];
    var q = [line.vertices[1].x, line.vertices[1].y];
    var m = (q[1]-p[1])/(q[0]-p[0]);
    var x = (m*m*q[0] - m*q[1] + m*r[1] + r[0])/(m*m+1);
    var y = (-x/m)+ r[1]+r[0]/m;
    if(dashed){
        return drawDashedLine(canvas, r, [x, y]);
    }
    else return drawLine(canvas, r, [x, y]);
    
}
function lineDistance(line,r){
    var p = [line.vertices[0].x, line.vertices[0].y];
    var q = [line.vertices[1].x, line.vertices[1].y];

    return Math.abs((r[1] - p[1])*(q[0]-p[0]) - (q[1] - p[1])*(r[0] - p[0]));
}
function highlightPoint(point){
    point.fill = "#ff0000";
    point.radius = divsize * 2;
}
function dehighlightPoint(point){
    point.fill = "#000000";
    point.radius = divsize ;
}
