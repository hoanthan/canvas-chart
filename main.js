const width = 334;
const height = 159;
let canvasWidth;
//get DPI
const getDpi = () => window.devicePixelRatio;

const el = document.createElement('canvas');
el.id = 'chart';
el.style.width = width;
el.style.height = `${height}px`;
document.body.append(el);
const canvas = document.getElementById('chart');
var ctx;

const data = [
    [50, 35],
    [100, 45],
    [150, 55],
    [200, 58],
    [250, 60],
    [300, 65]
]

const maxX = Math.max(...data.map(point => point[0])),
    maxY = Math.max(...data.map(point => point[1])),
    minX = Math.min(...data.map(point => point[0])),
    minY = Math.min(...data.map(point => point[1]));

const getXPoint = (x) => {
    return (canvasWidth / maxX) * x;
}

const getYPoint = (y) => {
    return (height / 100) * y;
}

if (canvas.getContext) {
    ctx = canvas.getContext('2d');
    console.log(ctx);
}

function fixDpi() {
    //get CSS height
    //the + prefix casts it to an integer
    //the slice method gets rid of "px"
    let style_height = +getComputedStyle(canvas).getPropertyValue("height").slice(0, -2);
    //get CSS width
    let style_width = +getComputedStyle(canvas).getPropertyValue("width").slice(0, -2);
    //scale the canvas
    canvas.setAttribute('height', style_height * getDpi());
    canvas.setAttribute('width', style_width * getDpi());
}

function drawLine(to) {
    if (!ctx) return;
    ctx.lineTo(to.x, to.y);
}

function drawX() {
    if (!canvasWidth) return;
    ctx.strokeStyle = '#dcdee3';
    ctx.beginPath();
    ctx.moveTo(canvasWidth, height);
    drawLine({
        x: 0,
        y: height
    });
    ctx.stroke();
    ctx.closePath();
}

function drawY() {
    ctx.beginPath();
    ctx.moveTo(0, height);
    ctx.lineTo(0, 0);
    ctx.stroke();
    ctx.closePath();
}


function drawChart() {
    let region = new Path2D();
    ctx.strokeStyle = '#cd4e4c';
    ctx.lineWidth = 2;
    const yPoint0 = height - getYPoint(minY);
    region.moveTo(0, yPoint0);
    let lastHeight = height;
    console.log('max X:', maxX);
    console.log('max Y:', maxY);

    let lastPoint;

    data.forEach((line, index) => {
        if (index === 0) return;
        const [x, y] = line,
            xPoint = getXPoint(x),
            yPoint = height - getYPoint(y);

        console.log(xPoint, yPoint);

        region.lineTo(xPoint, yPoint);
        lastPoint = {
            x: xPoint,
            y: yPoint
        }
    })
    ctx.stroke(region);
    let region2 = new Path2D();
    region2.moveTo(lastPoint.x, lastPoint.y);
    region2.lineTo(canvasWidth, yPoint0);
    region2.lineTo(0, yPoint0);
    ctx.strokeStyle = 'transparent';
    ctx.stroke(region2);
    region.addPath(region2);
    ctx.fill(region);

}

function draw() {
    if (!ctx) return;
    fixDpi();
    canvasWidth = canvas.clientWidth;

    drawX();

    const gradientStart = height - getYPoint(maxY);
    const gradientEnd = height - getYPoint(minY)
    console.log('start gradiant', gradientStart);
    console.log('end gradiant', gradientEnd);

    var lingrad = ctx.createLinearGradient(0, gradientStart, 0, gradientEnd);
    lingrad.addColorStop(0, 'rgba(205, 78, 76, 0.4)');
    lingrad.addColorStop(0.78, 'rgba(205, 78, 76, 0.04)');
    lingrad.addColorStop(1, 'rgba(205, 78, 76, 0)');
    ctx.fillStyle = lingrad;

    drawChart();
}
window.onload = () => {
    requestAnimationFrame(draw);
};