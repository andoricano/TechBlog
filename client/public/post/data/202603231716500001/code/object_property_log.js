const user = { 
    name: "JS", age: 100
 };

console.log(user.name); // "JS"
console.log(user.age); // 100
console.log(user.unde); // undefined

Object.prototype.unde = "I am Prototype's Value";
console.log(user.unde); // "I am Prototype's Value"

Object.objectUnde = "I am from Object directly";
console.log(user.objectUnde);