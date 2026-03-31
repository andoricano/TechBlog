const user = {
  a: 10,
  b: 20,
  c: "JS"
};

user.a = 100;
user.b = 200;
user.c = "JavaScript";

console.log(user); //>>> { a: 100, b: 200, c: "JavaScript" }

try {
  user = { a: 1, b: 2, c: "New" }; 
} catch (err) {
  console.error(err.message);//>>> Assignment to constant variable.
}