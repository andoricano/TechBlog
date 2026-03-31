var a = 30;

function changeAFake(){
    var a = 60
    console.log("fake a = ", a)
    a = 40
    console.log("fake a = ", a)
}

function changeA(){
    a = 50
}

console.log("global a = ",a)
changeAFake()
console.log("global a = ",a)
changeA()
console.log("global a = ",a)

/*
result
global a =  30
fake a =  60
fake a =  40
global a =  30
global a =  50
*/