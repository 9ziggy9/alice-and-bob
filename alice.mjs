import * as net from 'net';
import * as fs from 'fs';
import {RED, GREEN, YELLOW,
	BLUE, MAGENTA, CYAN,
	parseArgs} from './lib.mjs';
import * as Routine from './Routines.mjs';

const aliceOperators = [
  "ECHO", "KNOCK", "LOG", "GET",
];

function aliceHear(msg) {
  console.log(YELLOW, "Alice heard:", msg);
}

function aliceSay(msg) {
  console.log(GREEN, "Alice says:", msg);
}

function handleOps([msg, op], stack, log) {
  switch(op) {
  case "ECHO":
    aliceSay(msg);
    break;
  case "LOG":
    console.log(GREEN, "Alice's command log:");
    console.table(log);
    break;
  case "KNOCK":
    console.log(YELLOW, "YOU HAVE ENTERED KNOCK KNOCK MODE");
    aliceSay("Who's there?");
    Routine.knockKnock.reverse().forEach(op => stack.push(op));
    break;
  case "GET":
    const data = fs.readFileSync(`./${msg}.txt`, {encoding: 'utf8'});
    data.trim().split("\n").forEach(line => aliceSay(line));
    break;
  default:
    console.log(RED, "PANIC PANIC PANIC, operator not handled");
    return -1;
  }
}

function handleStack([msg,op], stack) {
  const [routine, task] = stack.pop().split("->");
  switch (routine) {
  case "KNOCK": // I could abstract this, but why?
    if (task === "who") aliceSay(`${msg}, who?`);
    else {
      aliceSay("lel"); 
      console.log(YELLOW, "LEAVING KNOCK KNOCK MODE");
    }
    break;
  }
}

// my server
net.createServer(function (socket) {
  let LOG = [];
  let STACK = []; // y no q? Stack faster.
  socket.on("data", function (data) {
    const args = parseArgs(data, aliceOperators);
    const [msg, op] = args;
    if (STACK.length) {
      handleStack(args, STACK);
    } else if (op) {
      handleOps(args, STACK, LOG);
    } else {
      aliceHear(msg);
    }
    LOG.push(`${op}::${msg}`);
  });
  socket.on("end", function () {
    aliceSay("Good bye!");
  });
}).listen(8080);
