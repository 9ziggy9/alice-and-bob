import * as net from 'net';
import * as fs from 'fs';
import * as Subroutines from './routines.mjs';
import {RED, GREEN, YELLOW,
	BLUE, MAGENTA, CYAN,
	parseArgs} from './lib.mjs';

const aliceOperators = [
  "ECHO", "LOG", "GET", "KNOCK"
];

function aliceHear(msg) {
  console.log(YELLOW, "Alice heard:", msg);
}

function aliceSay(msg) {
  console.log(GREEN, "Alice says:", msg);
}

function handleOps([msg, op], env) {
  switch(op) {
  case "ECHO":
    aliceSay(msg);
    break;
  case "LOG":
    console.log(GREEN, "Alice's log:");
    aliceSay(env.LOG);
    break;
  case "KNOCK":
    console.log(YELLOW, "Entering KNOCK subroutine");
    aliceSay("Who's there?");
    Subroutines.knockKnock.forEach(op => env.STACK.push(op));
    break;
  case "GET":
    const data = fs.readFileSync(`./${msg}.txt`, {encoding: "utf8"});
    data.trim().split("\n").forEach(line => aliceSay(line));
    break;
  default:
    console.log(RED, "PANIC PANIC PANIC, operator not handled");
    process.exit(1);
  }
}

function handleStack([msg, op], env) {
  // `${routine}->${task}`
  const [routine, task] = env.STACK.pop().split("->");
  console.log(routine, task);
  switch (routine) {
  case "KNOCK":
    if (task === "who") aliceSay(`${msg}, who?`);
    else {
      aliceSay("lel");
      console.log(YELLOW, "Exiting KNOCK subroutine");
    }
    break;
  }
}

// my server
net.createServer(function (socket) {
  let env = {
    LOG: [],
    STACK: [],
  };
  socket.on("data", function (data) {
    const args = parseArgs(data, aliceOperators);
    const [msg, op] = args;
    if (env.STACK.length > 0) { // subroutines go here
      handleStack(args, env);
    } else if (op) {
      handleOps(args, env);
    } else {
      console.log(data);
      aliceHear(msg);
    }
    env.LOG.push(`${op}::${msg}`);
  });
}).listen(8080);
