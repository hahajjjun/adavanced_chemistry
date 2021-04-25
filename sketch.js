let bx, by;
let globalflag = 0;
let system;
let transparency = 0;
let cx1=263;
let cx2=108;
let cx3=172;
let cy1=72;
let cy2=58;
let cy3=77;
var sw = {
  // (A) INITIALIZE
  etime : null, // HTML time display
  erst : null, // HTML reset button
  ego : null, // HTML start/stop button
  init : function () {
    // (A1) GET HTML ELEMENTS
    sw.etime = document.getElementById("sw-time");
    //sw.erst = document.getElementById("sw-rst");
    sw.ego = document.getElementById("sw-go");

    // (A2) ENABLE BUTTON CONTROLS
    //sw.erst.addEventListener("click", sw.reset);
    //sw.erst.disabled = false;
    sw.ego.addEventListener("click", sw.start);
    sw.ego.disabled = false;
  },

  // (B) TIMER ACTION
  timer : null, // timer object
  now : 0, // current elapsed time
  tick : function () {
    // (B1) CALCULATE HOURS, MINS, SECONDS
    sw.now++;
    var remain = sw.now;
    var hours = Math.floor(remain / 3600);
    remain -= hours * 3600;
    var mins = Math.floor(remain / 60);
    remain -= mins * 60;
    var secs = remain;

    // (B2) UPDATE THE DISPLAY TIMER
    if (hours<10) { hours = "0" + hours; }
    if (mins<10) { mins = "0" + mins; }
    if (secs<10) { secs = "0" + secs; }
    sw.etime.innerHTML = hours + ":" + mins + ":" + secs;
  },
  
  // (C) START!
  start : function () {
    sw.timer = setInterval(sw.tick, 1000);
    sw.ego.value = "Stop.";
    sw.ego.removeEventListener("click", sw.start);
    sw.ego.addEventListener("click", sw.stop);
  },

  // (D) STOP
  stop  : function () {
    clearInterval(sw.timer);
    sw.timer = null;
    sw.ego.value = "Start.";
    sw.ego.removeEventListener("click", sw.stop);
    sw.ego.addEventListener("click", sw.start);
  },

  // (E) RESET
  reset : function () {
    if (sw.timer != null) { sw.stop(); }
    sw.now = -1;
    globalflag=1;
  }
};
window.addEventListener("load", sw.init);
function setup() {
  var cnv = createCanvas(500,500);
  cnv.parent("controls");
  base = loadImage("png/base.png");
  cd = loadImage("png/cd.png");
  cd_45 = loadImage("png/cd_45.png");
  cis = loadImage("png/cis.png");
  trans = loadImage("png/trans.png");
  base2 = loadImage("png/base2.PNG");
  bx=width/2.0;
  by=height/2.0;
  system = new ParticleSystem(createVector(width/2,50));
}

// 간단한 파티클 클래스
let Particle = function(position) {
  this.acceleration = createVector(0, 0.05);
  this.velocity = createVector(random(-1, 1), random(-1, 0));
  this.position = position.copy();
  this.lifespan = 220;
  this.temp = 0;
  this.flag = 0;
};

Particle.prototype.run = function() {
  this.update();
  this.display();
};

// 위치 업데이트를 위한 메소드
Particle.prototype.update = function(){
  this.velocity.add(this.acceleration);
  this.position.add(this.velocity);
  if(
    (this.position.y>300 & this.position.x<123) ||
    (this.position.y>300 & this.position.x>167 & this.position.x<215) |
    (this.position.y>300 & this.position.x>262 & this.position.x<315) |
    (this.position.y>300 & this.position.x>359)
  ){
    if(this.flag%2 == 0)
    this.position.x-=this.velocity.x*random(0,100);
    this.flag++;
  }
  if(
    (this.position.y>300 & this.position.x>118 & this.position.x<172) ||
    (this.position.y>300 & this.position.x>220 & this.position.x<267) |
    (this.position.y>300 & this.position.x>320 & this.position.x<364)
  ){
    this.lifespan+=10;
  }
  else{
    this.lifespan -= 2;
  }
  if(this.position.y>390){
    this.position.y -= this.velocity.y;
    if(this.position.y>390){
      this.temp=390-sw.now*20;
      this.position.y=this.temp;
    }
  }
};

// 화면에 보이기 위한 메소드
Particle.prototype.display = function() {
  stroke(255, this.lifespan);
  strokeWeight(0);
  if(this.position.y<400){
    if(
      (this.position.y>300 & this.position.x<113) ||
      (this.position.y>300 & this.position.x>172 & this.position.x<220) |
      (this.position.y>300 & this.position.x>267 & this.position.x<320) |
      (this.position.y>300 & this.position.x>364)
    ){
      fill(255,255,255,0);
    }
    else{
      fill(255,0,0,this.lifespan);
    }
  }
  else{
    fill(255,255,255,0);
  }
  
  ellipse(this.position.x, this.position.y, 12, 12);
};

// 파티클이 여전히 쓸만한가요?
Particle.prototype.isDead = function(){
  return this.lifespan < 0;
};

let ParticleSystem = function(position) {
  this.origin = position.copy();
  this.particles = [];
};

ParticleSystem.prototype.addParticle = function() {
  this.particles.push(new Particle(this.origin));
};

ParticleSystem.prototype.run = function() {
  for (let i = this.particles.length-1; i >= 0; i--) {
    let p = this.particles[i];
    p.run();
    if (p.isDead()) {
      this.particles.splice(i, 1);
    }
  }
};

function draw() {
  background(255);
  
  image(base,bx-200,by*2-200,400,160);
  image(trans,100+10,266,50,40);
  image(trans,195+10,265,50,40);
  image(trans,295+10,268,50,40);
  //image(cis, bx-100, by,30,30);
  if(sw.now>0.1 & sw.now<15){
    system.addParticle();
    system.run();
  }
  
  if(sw.now>=12){
    image(cd_45,cx1,cy1,100,100);
    image(cd_45,cx2,cy2,100,100);
    image(cd_45,cx3,cy3,100,100);
    if(sw.now<12.5){
      cx1-=1.4;
      cy1+=1;
      cx2+=0.3;
      cy2+=1.2;
      cx3+=1.2;
      cy3+=1;
    }
    else if(sw.now<12.75){
      cx1-=0.8;
      cy1+=1;
      cx2+=0.3;
      cy2+=1.2;
      cx3+=1.2;
      cy3+=1;
    }
    else if(sw.now<13.5){
      cx1-=0.8;
      cy1+=1;
      cx2+=0.3;
      cy2+=1.2;
      cx3+=1/3;
      cy3+=1;
    }
    else if(sw.now<14.25){
      cx1-=1;
      cy1+=1;
      cx2+=0.7;
      cy2+=0.8;
      cx3+=1/3;
      cy3+=1;
    }
    else if(sw.now<15){
      cx1-=1;
      cy1+=1;
      cx2+=0.7;
      cy2+=0.8;
      cx3+=0.8;
      cy3+=1;
    }
  }
  if(sw.now>=15){
    for(i=0;i<15;i++){
      fill(255,0,0);
      stroke(0);
      strokeWeight(0);
      ellipse(146+random(-20,20),385.7083320617676+random(-60,10),12,12);
      ellipse(242+random(-20,20),385.7083320617676+random(-60,10),12,12);
      ellipse(338+random(-20,20),385.7083320617676+random(-60,10),12,12);
    }
  }
  
  
}

function mousePressed() {
  console.log(mouseX,mouseY);
}

function mouseDragged() {
  
}

function mouseReleased() {
  
}
