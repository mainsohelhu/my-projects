console.log("hello i am sohel");
let age = 20;
if (age < 18){
    console.log("you can not drink alchohol")
}
else{
    console.log("you can drink alchohol")
}
let a = 10;
let b = 20;
// let c =  a > b ? (a - b) : (b + a)
// console.log(c)
if (a > b){
    console.log(a - b)
}
else {
    console.log(a + b)
}
let x = 10
let y = 20
// if (x + y == 30){
//     console.log("sahi hai")
// }
// else{
//     console.log("sahi nahi hai")
// }
let person = {
    name: "sohel",
    age : 24,
    work : " web developer",
    "mental health": "unstable",
}

console.log(person.name)
// console.log(this.name)
if (person.name == "s"){
    console.log("yes we did it")
}
else{
    console.log("fuck no")
}
let sohel = {
    ussername: "sohel",
    password: 154, 
}
if (sohel.password === "154"){
    console.log("je baat")

}
else{
    console.log("fuck not again")
}
let num1 = 4;
let num2 = 6;
let num3 = (num1 + num2)
console.log(num3)
let num4 = 1;
// for (let i = 0; i >= -20; i--) {
//     console.log(i)
    
// }
for (let  y = 10; y <= 100; y++){
    console.log(y)
}
for (let g = 200; g >= 2; g--){
    console.log(g)
}
let dovish = {
    marks :500
}
let sohel1= {
    marks: 400
}
if (dovish.marks == sohel1.marks){
    console.log("winner")
}
else{
    console.log("looser")
}
for ( let i = 0; i <= 100; i++){
    console.log(i)
}
let dino = {
    Gender: "male",
    age:24,
    class: "A"

}
for (const key in dino) {
    
    const element = dino[key];
    console.log(key,element)
    
    
}
let job ={
    roll: "programmer"
}
for( const key in job){
    const jhat = job[key];
    console.log(key,jhat)
}
let graph ={
    " graph":"sahi hai",
    mannager: "bhosdi ka",
}
// for (const key in graph){
//     const l = graph[key]
//     console.log(key,l)
// }
for (const key in graph) {
    if (!Object.hasOwn(graph, key)) continue;
    
    const element = graph[key];
    console.log(key,element)
    
    
}
function greet(name){
    console.log("hey" + name+ "ki haal chal")
}
greet("sohel")
