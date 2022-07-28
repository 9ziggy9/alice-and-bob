function hello(str) {
  if (str === "Amanda") {
    console.log("Amanda is cool");
  } else if (str === "John") {
    console.log("John like Java");
  } else if (str === "Yeshi") {
    console.log("Yeshi knows what a socket is");
  }
}

function helloSwitch(str) {
  switch (str) {
  case "Alex":
  case "Abe":
  case "Adam":
  case "Aijia":
  case "Amanda":
    return "Name starts with A";
  case "John":
    console.log("John like Java");
    break;
  case "Yeshi":
    console.log("Yeshi knows what a socket is");
    break;
  default:
    console.log("I don't know who that is");
    break;
  }
}

const binaryBlob = Buffer.from([65,65,65]);
console.log(binaryBlob.toString());

