let arr = [1,2,3,4,5]
let bignum = arr[0]
for (let i = 1; i < arr.length; i++) {
    const element = arr[i];
    if (element > bignum){
        bignum = element;
    }
}
console.log(bignum);


let bigest = arr.reduce((a,b) => {
return a > b ? a : b ;
})
console.log(bigest);

function pelindrom(numb) {
    
    let you = numb ;
    let pel = you.toString().split("").reverse().join("");
    let result =  (you == pel) ? "pelindrom" : "not";
    console.log(result);
    
}

pelindrom("hello")

let number = [1,2,3,4,5,6,9];

let biggest = -Infinity;
let secondBiggest = -Infinity;

for (let i = 0; i < number.length; i++) {
    let element = number[i];

    if (element > biggest) {
        secondBiggest = biggest;
        biggest = element;
    } 
    else if (element > secondBiggest && element < biggest) {
        secondBiggest = element;
    }
}

console.log(secondBiggest); // 6
let t = "level";
let f = "";
for (let i = t.length ; i >= 0; i--){
    const element = t[i]
    console.log();
    
    
}
if (f == t){
    console.log("this");
    
}else{
    console.log("not");
    
}

let num = [1,2,3,4,5]
let total = 0;
for(let i = 0; i < num.length; i++){
    const n = num[i]
    total += n
}
console.log(total);

