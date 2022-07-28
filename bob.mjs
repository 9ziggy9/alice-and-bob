import * as net from 'net';
import * as fs from 'fs';
import {RED, GREEN, YELLOW,
	BLUE, MAGENTA, CYAN,
	parseArgs} from './lib.mjs';
import * as Routine from './Routines.mjs';

const bobOperators = [
  "ECHO", "LOG", "PROXY"
];

function bobHear(msg) {
  console.log(YELLOW, "Bob heard:", msg);
}

function bobSay(msg) {
  console.log(GREEN, "Bob says:", msg);
}

function handleOps([msg, op], env, data) {
  switch(op) {
  case "ECHO":
    bobSay(msg);
    if (env.SOCKET) env.SOCKET.write(msg);
    break;
  case "LOG":
    console.log(GREEN, "Bob's command log:");
    console.table(env.LOG);
    break;
  case "PROXY":
    console.log(YELLOW, `BOB is proxying to ${msg}`);
    env.PROXY = Number(msg);
    env.SOCKET = net.Socket().connect(env.PROXY);
    break;
  default:
    console.log(RED, "PANIC PANIC PANIC, operator not handled");
    return -1;
  }
}

function handleStack([msg,op], stack) {
}

// my server
net.createServer(function (socket) {
  // Doing this because of pass by ref bullshit
  const env = {
    LOG: [],
    STACK: [], //Stack is technically faster
    PROXY: null,
    SOCKET: null,
  };
  socket.on("data", function (data) {
    const args = parseArgs(data, bobOperators);
    const [msg, op] = args;
    if (env.STACK.length) {
      handleStack(args, env.STACK);
    } else if (op) {
      handleOps(args, env, data);
    } else {
      bobHear(msg);
    }
    env.LOG.push(`${op}::${msg}`);
  });
  socket.on("end", function() {
    bobSay("Good bye!");
    process.exit(0); // exit successfully
  });
}).listen(8081);
