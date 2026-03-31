for (var i = 0; i < 3; i++) {
  console.log("for i = ",i);
}
console.log("i??? = ",i);

for (let j = 0; j < 3; j++) {
  console.log("for j = ",j)
}
console.log(j)

/*
for i =  0
for i =  1
for i =  2
i??? =  3
for j =  0
for j =  1
for j =  2
console.log(j)
            ^
ReferenceError: j is not defined
*/