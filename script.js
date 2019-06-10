const canvas = document.getElementById("pong");

const ctx = canvas.getContext('2d');

const ball = {
    x : canvas.width/2,
    y : canvas.height/2,
    radius : 10,
    velocityX : 5,
    velocityY : 5,
    speed : 5,
    color : "WHITE"
}


const user = {
    x : 0,
    y : (canvas.height - 100)/2,
    width : 10,
    height : 100,
    score : 0,
    color : "WHITE"
}

const com = {
    x : canvas.width - 10,
    y : (canvas.height - 100)/2,
    width : 10,
    height : 100,
    score : 0,
    color : "WHITE"
}

const net = {
    x : (canvas.width - 2)/2,
    y : 0,
    height : 10,
    width : 2,
    color : "WHITE"
}

function drawRect(x, y, w, h, color){
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawArc(x, y, r, color){
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2,true);
    ctx.closePath();
    ctx.fill();
}

canvas.addEventListener("mousemove", getMousePos);

function getMousePos(evt){
    let rect = canvas.getBoundingClientRect();

    user.y = evt.clientY - rect.top - user.height/2;
}

function resetBall(){
    ball.x = canvas.width/2;
    ball.y = canvas.height/2;
    ball.speed = 5;
    ball.velocityX = -ball.velocityX;
}

function drawNet(){
    for(let i = 0; i <= canvas.height; i+=15){
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
    }
}

function drawText(text,x,y){
    ctx.fillStyle = "DARKTURQUOISE";
    ctx.font = "75px fantasy";
    ctx.fillText(text, x, y);
}

function collision(b,p){
    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;

    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;

    return p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top;
}

function update(){
    if(com.score < 5 && user.score < 5){
        if( ball.x - ball.radius < 0 ){
            com.score++;
            resetBall();
        }else if( ball.x + ball.radius > canvas.width){
            user.score++;
            resetBall();
        }

        ball.x += ball.velocityX;
        ball.y += ball.velocityY;


        com.y += ((ball.y - (com.y + com.height/2)))*0.1;

        if(ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height){
            ball.velocityY = -ball.velocityY;
        }

        let player = (ball.x + ball.radius < canvas.width/2) ? user : com;

        if(collision(ball,player)){
            let collidePoint = (ball.y - (player.y + player.height/2));
            collidePoint = collidePoint / (player.height/2);

            let angleRad = (Math.PI/4) * collidePoint;

            let direction = (ball.x + ball.radius < canvas.width/2) ? 1 : -1;
            ball.velocityX = direction * ball.speed * Math.cos(angleRad);
            ball.velocityY = ball.speed * Math.sin(angleRad);

            ball.speed += 0.1;
        }
    }
}

function render(){
    drawRect(0, 0, canvas.width, canvas.height, "#000");
    drawText(user.score,canvas.width/4,canvas.height/5);
    drawText(com.score,3*canvas.width/4,canvas.height/5);
    drawNet();
    drawRect(user.x, user.y, user.width, user.height, user.color);
    drawRect(com.x, com.y, com.width, com.height, com.color);
    if(com.score < 5 && user.score < 5) {
        drawArc(ball.x, ball.y, ball.radius, ball.color);
    } else {
        var playAgain = document.createElement("button");
        playAgain.innerHTML = "Play Again";
        document.getElementById("playAgain").appendChild(playAgain);
        playAgain.setAttribute("class", "w3-btn w3-round-xxlarge");
        playAgain.setAttribute("id", "againButtons");
        playAgain.setAttribute("onclick", "document.location.reload()");
        var endMessage = document.createElement("button");
        if(user.score == 5){
            endMessage.innerHTML = "You Win!";
        }
        if(com.score == 5){
            endMessage.innerHTML = "You Lose!";
        }
        document.getElementById("endMessage").appendChild(endMessage);
        endMessage.setAttribute("class", "w3-btn w3-round-xxlarge");
        endMessage.setAttribute("id", "endButtons");
        endMessage.setAttribute("onclick", "document.location.reload()");
    }

}
function game(){
    document.getElementById("button").disabled = true;
    update();
    render();
}

function run(){

    let framePerSecond = 50;

    let loop = setInterval(game,1000/framePerSecond);

}



