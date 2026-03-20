var a = 20
function changeA(){
    var a = 30
    console.log("function a = ", a)
    if(true){
        var a = 60
        console.log("function if a = ", a)
    }
    console.log("function a = ", a)
    var a = 40
    a = 10
}

changeA()

console.log("global a = ", a)

/*
result
function a =  30
function if a =  60
function a =  60
global a =  20
*/