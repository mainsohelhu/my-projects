let a = "sohel";
console.log (a)
let s = {
    name : "sohel",
    "age" : 24,
    "name of city" : "raipur" ,
    "is employed": true

}
console.log (s)
s.slary ="aurthur";
console.log(s)
s.slary = "40000";
console.log(s)
console.log(typeof s)
const i = "ishika";
console.log(i)
// i = "renuka";
// let age = 18;
// let text = "you can not drive you bitch";
// if (age >= 18){
//     text = "you can drive you bitch";
// }
// document.getElementById("demo").innerHTML= text; 
let age = 18;
let contry = "india";
let text = "you can drive";

// if (contry == "india"){
    //     if (age >= 18){
        //         text = "you can drive"
        //     }
        // }
        // document.getElementById("demo").innerHTML = text;
        // document.getElementById("demo").style.color=red;
// if (contry == "india" && age >= 18 ){
//     text = "han bhai tu chala sakta hai!";
// }
// document.getElementById("demo").innerHTML = text;
const hour = new Date().getHours();
let greetings;
if ( hour > 10 ){
    greetings = "das bahne kar ke le gaye dil";
}
else{
    greetings = "char baj gaye lekin party abhi baki hai"
}
document.getElementById("demo").innerHTML= greetings;
document.getElementById("demo").style.cssText = `
color: white;
padding : 20px;
font-size: 20px;
background-color: black;
text-align : center;
`;
const grocry = [ "aalu", "pyaj", "kela", "gobhi","bhaji"];
let txt = "";
for ( let i = 0; i < grocry.length; i++){
txt += grocry[i]+ "<br>";
}
document.getElementById("demo2").innerHTML= txt;
let k = ["boin","bing","bong"];
let t = "";
for (let i = 0; i < k.length; i++ ){
    t += k[i] + "<br>";
}
document.getElementById("demo3").innerHTML = t;
