//1. object o 생성
const o = {
    a: 0,
    b: "10"
};


//2. 최상위 object의 prototype 공간의 a와 c에 10과 20 생성
Object.prototype.a = 10;
Object.prototype.c = 20;

//3. o의 프로퍼티에 접근
console.log("1. 단순한 o.a와 o.b 출력 : ", o.a, o.b); // >> 0, 10

//4. o의 프로퍼티에 접근했을 때 없으니 o의 __proto__ 접근하여 c있는지 확인
console.log("2. o.c 없으니까 상위 어딘가로 찾으러감 : ", o.c); // >> 20

//5. __proto__에 접근하여 직접 확인
console.log("3. o.__proto__.a 는 프로토타입 체인 중 가장 가까운 프로토타입의 a :", o.__proto__.a); // >> 10
console.log("4. o.__proto__.c 위와 같은 프로토타입의 c:", o.__proto__.c); // >> 20


//6. Object의 prototype 공간이 아닌 자기 공간에 oa 생성 후 확인
Object.oa = 10
console.log(o.oa);// >> undefined

//7. object 타입의 프로토타입에 a 설정해보기
// o.prototype.a = 3; // >> TypeError: Cannot set properties of undefined (setting 'a')