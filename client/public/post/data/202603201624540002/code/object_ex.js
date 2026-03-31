///////JS Object////////

// 1. Object Literal
const user = { name: "Kim", age: 30 }; 

// 2. Reference 복사
const admin = user; 

// 3. 내부 값 변경
admin.age = 40;

console.log(user.age); // 40
console.log(user === admin); // true

// user = function(){a = 30; console.log(a())}
// >>> TypeError: Assignment to constant variable.
//------------------------------------------------------------

// 1. Array
console.log(a); // >>> undefined, let으로 하면 reference error
//console.log(a[0]); // >>> TypeError: Cannot read properties of undefined (reading '0')

var a = [10, 20]; 
console.log(a[0]); // >>> 10

// 2. Function
a = function() { return "hello"; };
console.log(a()) // >>> hello

class Player { constructor(name) { this.name = name; } }
a = new Player("JS");
console.log(a.name, a.undefined, a[100]); // >>> JS undefined undefined 
// console.log(a()); // >>> TypeError: a is not a function

a = [20,30]
console.log(a[0], a.property) //>> 20 undefined

a = null;

//console.log(a[0])// >>> TypeError: Cannot read properties of null (reading '0')
//console.log(a())// >>> TypeError: a is not a function
//console.log(a.name)// >>> TypeError: Cannot read properties of null (reading 'name')
console.log(a)// >>> null