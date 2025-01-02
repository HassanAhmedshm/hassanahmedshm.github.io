const one = document.getElementById("one");
const two = document.getElementById("two");
const three = document.getElementById("three");
const four = document.getElementById("four");
const five = document.getElementById("five");
const six = document.getElementById("six");
const seven = document.getElementById("seven");
const eight = document.getElementById("eight");
const nine = document.getElementById("nine");
const zero = document.getElementById("zero");
const dot = document.getElementById("dot");

const erase = document.getElementById("erase");
const back = document.getElementById("back");

const plus = document.getElementById("plus");
const minus = document.getElementById("minus");
const multiply = document.getElementById("multiply");
const divide = document.getElementById("divide");

const equal = document.getElementById("equal");

const result = document.getElementById("result");

let firstnum;
let secondnum;
let i;
let num;

//atempt to make more than one operation
// if (firstnum && secondnum) {
//   plus.addEventListener("click", () => {
//     result.innerText = parseFloat(firstnum) + parseFloat(secondnum);
//   });
//   minus.addEventListener("click", () => {
//     result.innerText = parseFloat(firstnum) - parseFloat(secondnum);
//   });
//   multiply.addEventListener("click", () => {
//     result.innerText = parseFloat(firstnum) * parseFloat(secondnum);

//   });
//   divide.addEventListener("click", () => {
//     result.innerText = parseFloat(firstnum) / parseFloat(secondnum);
//   });
// }


erase.addEventListener("click", () => {
  result.innerText = "";
  console.log(firstnum);
  firstnum = result.innerText;
});

back.addEventListener("click", () => {
  result.innerText = result.innerText.slice(0, -1);
  secondnum = result.innerText;
  console.log(secondnum);
});

one.addEventListener("click", () => {
  result.innerText += 1;
  secondnum = result.innerText;
  console.log(secondnum);
});

two.addEventListener("click", () => {
  result.innerText += 2;
  secondnum = result.innerText;
  console.log(secondnum);
});
three.addEventListener("click", () => {
  result.innerText += 3;
  secondnum = result.innerText;
  console.log(secondnum);
});
four.addEventListener("click", () => {
  result.innerText += 4;
  secondnum = result.innerText;
  console.log(secondnum);
});
five.addEventListener("click", () => {
  result.innerText += 5;
  secondnum = result.innerText;
  console.log(secondnum);
});
six.addEventListener("click", () => {
  result.innerText += 6;
  secondnum = result.innerText;
  console.log(secondnum);
});
seven.addEventListener("click", () => {
  result.innerText += 7;
  secondnum = result.innerText;
  console.log(secondnum);
});
eight.addEventListener("click", () => {
  result.innerText += 8;
  secondnum = result.innerText;
  console.log(secondnum);
});
nine.addEventListener("click", () => {
  result.innerText += 9;
  secondnum = result.innerText;
  console.log(secondnum);
});
zero.addEventListener("click", () => {
  result.innerText += 0;
  secondnum = result.innerText;
  console.log(secondnum);
});
dot.addEventListener("click", () => {
  result.innerText += ".";
  secondnum = result.innerText;
  console.log(secondnum);
});

plus.addEventListener("click", () => {
  firstnum = result.innerText;
  console.log(firstnum);
  result.innerText = "";
  i = 1;
});
minus.addEventListener("click", () => {
  firstnum = result.innerText;
  console.log(firstnum);
  result.innerText = "";
  i = 2;
});
multiply.addEventListener("click", () => {
  firstnum = result.innerText;
  console.log(firstnum);
  result.innerText = "";
  i = 3;
});
divide.addEventListener("click", () => {
  firstnum = result.innerText;
  console.log(firstnum);
  result.innerText = "";
  i = 4;
});

equal.addEventListener("click", () => {
  switch (i) {
    case 1:
      result.innerText = parseFloat(firstnum) + parseFloat(secondnum);
      break;
    case 2:
      result.innerText = parseFloat(firstnum) - parseFloat(secondnum);
      break;
    case 3:
      result.innerText = parseFloat(firstnum) * parseFloat(secondnum);
      break;
    case 4:
      result.innerText = parseFloat(firstnum) / parseFloat(secondnum);
      break;
    default:
      console.log("error");
      break;
  }
});
