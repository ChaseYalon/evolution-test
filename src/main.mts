const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
const range = canvas.height * 0.05;
import { Network } from "./nn.mts";
function drawCircle(x: number, y: number, radius: number, color: string): void {
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.fill(); // use fill to apply the fillStyle
  // ctx.stroke(); // uncomment this if you also want the outline
}

function eraseCircle(x: number, y: number, radius: number): void {
  ctx.beginPath();
  ctx.fillStyle = "white";
  ctx.arc(x, y, 1.1 * radius, 0, 2 * Math.PI);
  ctx.fill(); // use fill to apply the fillStyle
  // ctx.stroke(); // uncomment this if you also want the outline
}

export function getRand(min : number, max : number) : number {
  return Math.random() * (max - min) + min;
}

function calcDist(A1 : Animal, A2 : Animal) : number{
  return Math.sqrt(Math.pow(A2.x-A1.x,2)+Math.pow(A2.y-A1.y,2));
}

function clamp(input : number, range : number) {
  let output =  Math.min(Math.max(input, -range), range);

  if(output < 0 ){
    return 0;
  }else if (output > canvas.width){
    return canvas.width;
  }else {
    return output;
  }
  
}

class Animal {
  brain : Network
  health: number = 10; // Always between 1 and 10
  nearestCreature : Animal[] = [];
  x : number;
  y : number;

  constructor(private arr: Animal[],x : number, y : number, brain : Network) {
    this.arr.push(this);
    this.x = x;
    this.y = y;
    this.brain = brain;
    drawCircle(x,y,5,"red");
  }
  getNearestAnimals() : void{
    let withinTen : Animal[] = [];
    for (let i = 0; i < predators.length; i++){
      const distance = calcDist(this,predators[i]);
      if(distance < canvas.height/10){
        withinTen.push(predators[i])
      }
    }
    for (let i = 0; i < prey.length; i++){
      const distance = calcDist(this,prey[i]);
      if(distance < canvas.height/10){
        withinTen.push(prey[i])
      }
    }
    this.nearestCreature = withinTen;  

  }
  die(): void {
    const index = this.arr.indexOf(this);
    eraseCircle(this.x, this.y, 5);
    if (index > -1) {
      this.arr.splice(index, 1);
    }
  }

  move(dX : number, dY : number, isPrey : boolean) : void {
    eraseCircle(this.x, this.y, 5);
    this.x += clamp(dX, range);
    this.y += clamp(dY, range);
    drawCircle(this.x, this.y, 5, isPrey ? "green" : "red");
  }


}

class Prey extends Animal {
  constructor(arr: Animal[], x : number, y : number) {
    super(arr, x, y);

  }
  onTick():void{
    this.getNearestAnimals();

    this.move(getRand(-range, range),getRand(-range, range),true);
  }

}

class Predator extends Animal {
  preyEaten: number = 0;
  timer: ReturnType<typeof setTimeout>;
  constructor(arr: Animal[], x : number, y : number) {
    super(arr, x, y);
    this.timer = setTimeout(() => {this.die();}, 10000);

  }

  onTick():void{
    this.getNearestAnimals();

    this.move(getRand(-range, range),getRand(-range, range),false);
    this.eat();
  }

  eat() : void {
    for (let i = 0; i < prey.length; i++){
      if(calcDist(this, prey[i]) < 10){
        console.log("eating");
        prey[i].die();
        clearTimeout(this.timer); // prevent stacking timeouts
        this.timer = setTimeout(() => {this.die();}, 10000);
        this.preyEaten++;
      }
    }
  }

  

  /*

    
    reproduce(){
    
    }

    control(){
    
    }

  */
}

const predators: Predator[] = [];
const prey: Prey[] = []

for (let i = 0; i < 50; i++){
  new Predator(predators, getRand(1,window.innerWidth),getRand(1,window.innerHeight));
}
for (let i = 0; i < 100; i++){
  new Prey(prey, getRand(1,window.innerWidth),getRand(1,window.innerHeight));
}

setInterval(() =>{
  prey.forEach((i) => {
    i.onTick();
  })
  predators.forEach((i) => {
    i.onTick();
  })
},1000)