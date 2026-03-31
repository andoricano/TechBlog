let user = { name: "Kim", age: 30 }; 
user.pro = 30

console.log(user.pro)
// >>> 30

user = function () {return "function type"}
console.log(user())
// >>> function type
console.log(user.pro)
// >>> undefined
user.pro = "pro"
console.log(user.pro)
// >>> pro

user = [30,"pro","perty"]
user.property = "property"
console.log(user)
// >>> [ 30, 'pro', 'perty', property: 'property' ]


user = { age : 30, property : "property", array: [0,1,2,3]};
user.addItem = "addItem"
user.array.addItem = "arrayAddItem"
// >>> {
//   age: 30,
//   property: 'property',
//   array: [ 0, 1, 2, 3, addItem: 'arrayAddItem' ],
//   addItem: 'addItem'
// }
console.log(user)