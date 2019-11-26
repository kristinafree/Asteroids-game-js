 const canvas = document.getElementById('game');
 const context = canvas.getContext('2d');

 let i, ship, timer;
 let aster = [];
 let fire = [];
 let expl = [];
 

//подгрузка изоброжений
 let asterimg = new Image();
 asterimg.src = 'img/astero.png';

 let shieldimg = new Image();
 shieldimg.src = 'img/shield.png';

 fireimg = new Image();
 fireimg.src = 'img/fire.png'

 shipimg = new Image();
 shipimg.src = 'img/ship.png';

 let explimg = new Image();
 explimg.src = 'img/expl222.png'

 let fonimg = new Image();
 fonimg.src = 'img/fon1.png';

 fonimg.onload = function() {
 	init();
 	game();
 }

 function init() {
 	canvas.addEventListener('mousemove', function(event) {

 	let rect = canvas.getBoundingClientRect(), root = document.documentElement;
 	let mouseX = event.clientX - rect.left - root.scrollLeft;
 	let mouseY = event.clientY - rect.top - root.scrollTop;
 	let width_canvas = document.getElementById("game").offsetWidth;
 	let height_canvas = document.getElementById("game").offsetHeight;

 	ship.x = mouseX * 960/width_canvas - 25;
 	ship.y = mouseY * 443/height_canvas- 13;
    });
 	
 	timer = 0;
 	ship = {x:300, y:300, animx: 0, animy: 0}
 }

 //основной цикл игры

 function game() {
 	update();
 	render();
 	requestAnimationFrame(game);
 }

 function update() {
 timer++;
 if(timer % 10 == 0){
 	aster.push({
 		angle:0,
		dxangle:Math.random()*0.2-0.1,
 		del: 0,
 		x:Math.random() * 550, 
 		y:-50, 
 		dx:Math.random() * 2 - 1, 
 		dy:Math.random() * 2 + 1,
 	});
 }

 if (timer % 30 == 0) {
 	fire.push({x:ship.x + 10, y:ship.y, dx:0, dy: -5.2});
 	fire.push({x:ship.x + 10, y:ship.y, dx:0.5, dy: -5});
 	fire.push({x:ship.x + 10, y:ship.y, dx: - 0.5, dy: -5});
 }

 for (i in aster) {
 	aster[i].x=aster[i].x+aster[i].dx;
	aster[i].y=aster[i].y+aster[i].dy;
	aster[i].angle=aster[i].angle+aster[i].dxangle;
	
//граничные условия (коллайдер со стенками)

if (aster[i].x<=0 || aster[i].x>=920) aster[i].dx=-aster[i].dx;
if (aster[i].y>=443) aster.splice(i,1);
	
//проверим каждый астероид на столкновение с каждой пулей

for (j in fire) {
	if (Math.abs(aster[i].x+25-fire[j].x-15)<50 && Math.abs(aster[i].y-fire[j].y)<25) {
		expl.push({x:aster[i].x-25,y:aster[i].y-25,animx:0,animy:0});
		aster[i].del=1; //помечаем астероид на удаление
		fire.splice(j,1);break;
	}
}

//удаляем астероиды
	if (aster[i].del==1) aster.splice(i,1);
}

//двигаем пули

for (i in fire) {
	fire[i].x=fire[i].x+fire[i].dx;
	fire[i].y=fire[i].y+fire[i].dy;
	if (fire[i].y<-30) fire.splice(i,1);
}

//анимация взрывов
for (i in expl) {
	expl[i].animx=expl[i].animx+0.5;
	if (expl[i].animx>7) {expl[i].animy++; expl[i].animx=0}
	if (expl[i].animy>7) 
	expl.splice(i,1);
}

//анимация щита
ship.animx=ship.animx+1;
	if (ship.animx>5) {ship.animy++; ship.animx=0}
	if (ship.animy>3) {
	ship.animx=0; ship.animy=0;
	}
}

function render() {
	context.drawImage(fonimg, 0, 0, 960, 443); //рисуем фон
	for (i in fire) 
		context.drawImage(fireimg, fire[i].x, fire[i].y, 30, 30); //рисуем пули
	context.drawImage(shipimg, ship.x, ship.y); //рисуем корабль
	context.drawImage(shieldimg, 190*Math.floor(ship.animx),190*Math.floor(ship.animy),190,190, ship.x-25, ship.y-25, 100, 100);
	//рисуем щит
	for (i in aster) {
	//context.drawImage(asterimg, aster[i].x, aster[i].y, 50, 50); рисуем астероиды
	//вращение астероидов
	    context.save();
		context.translate(aster[i].x+25, aster[i].y+25);
		context.rotate(aster[i].angle);
		context.drawImage(asterimg, -25, -25, 50, 50);
		context.restore();
		//context.beginPath();
		//context.lineWidth="2";
		//context.strokeStyle="green";
		//context.rect(aster[i].x, aster[i].y, 50, 50);
		//context.stroke();
	}
	
	//рисуем взрывы
	
	for (i in expl)
		context.drawImage(explimg, 128*Math.floor(expl[i].animx),128*Math.floor(expl[i].animy),128,128, expl[i].x, expl[i].y, 100, 100);
}