
const width = '100%';
const height = 500;

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
    [50, 50],
    [100, 75],
    [150, 150],
    [200, 300],
    [1240, 200]
]

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

let currentPosition = {
    x: 0,
    y: 0
}

function drawLine(to) {
    if (!ctx) return;
    ctx.lineTo(to.x, to.y);
}

function draw() {
    if (!ctx) return;
    fixDpi();
    const canvasWidth = canvas.clientWidth;

    const gradientStart = Math.min(...data.map(line => {
        const [x, y] = line;
        return height - y;
    }))
    var lingrad = ctx.createLinearGradient(0, gradientStart, 0, height);
    lingrad.addColorStop(0, '#000');
    lingrad.addColorStop(1, '#fff');
    ctx.fillStyle = lingrad;
    ctx.strokeStyle = 'red';

    ctx.beginPath();
    ctx.moveTo(canvasWidth, height);
    currentPosition = {
        x: canvasWidth + 20,
        y: height
    }
    drawLine({
        x: 0,
        y: height
    });
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.moveTo(0, height);
    let lastHeight = height;
    data.forEach(line => {
        const [x, y] = line;
        drawLine({
            x,
            y: height - y
        })
        lastHeight = height - y;
    })
    drawLine({
        x: canvasWidth,
        y: lastHeight
    })
    ctx.stroke();
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.moveTo(0, height);
    ctx.lineTo(0, 0);
    ctx.stroke();
    ctx.closePath();
}
window.onload = () => {
    requestAnimationFrame(draw);
};