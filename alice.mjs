import * as net from 'net';
import {RED, GREEN, YELLOW,
	BLUE, MAGENTA, CYAN,
	parseArgs} from './lib.mjs';

const aliceOperators = [
  "ECHO",
];

function aliceHear(msg) {
  console.log(YELLOW, "Alice heard:", msg);
}

function aliceSay(msg) {
  console.log(GREEN, "Alice says:", msg);
}

function handleOps([msg, op]) {
  switch(op) {
  case "ECHO":
    aliceSay(msg);
    break;
  default:
    console.log(RED, "PANIC PANIC PANIC, operator not handled");
    exit(1);
  }
}

// my server
net.createServer(function (socket) {
  socket.on("data", function (data) {
    const args = parseArgs(data, aliceOperators);
    const [msg, op] = args;
    if (op) {
      handleOps(args);
    } else {
      console.log(data);
      aliceHear(msg);
    }
  });
}).listen(8080);
