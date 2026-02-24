let num = 15;
function greet(name, age) {
    console.log(`hi my name is ${name} and i am ${age} years old`);
}

if(num > 10){
    let name = "sohel";
    let age = 24;
    greet(name, age)
}else{
    console.log1("the fuck is this");
    
}

function isEligible(age){
    // if(age >= 18){
    //     return "adult";
        
    // }else{
    //     return "minor"
        
    // }
    return (age >= 18) ? "adult":"minor";
}

console.log(isEligible(24));

function isEven(num){
    return num % 2 === 0 ? "even": "odd";
}
let result = isEven(3);
console.log(result);


function isdevide(num) {
   if(num % 3 === 0 && num % 5 === 0){
    console.log("fizzbuzz");
   }else if(num % 3 === 0){
    console.log("fizz");
   }else if(num % 5 === 0){
    console.log("buzz");
   }else{
    console.log("fucked");
    
   }
}

isdevide(8)

var slugify = require('slugify')

let a = slugify('bitch is back') // some-string

// if you prefer something other than '-' as separator
let b = slugify('some string', '_')  // some_string

console.log(a);
console.log(b);
