import * as net from 'net';
import * as fs from 'fs';
import * as Subroutines from './routines.mjs';
import {RED, GREEN, YELLOW,
	BLUE, MAGENTA, CYAN,
	parseArgs} from './lib.mjs';

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
    if (env.SOCKET) {
      env.SOCKET.write(data.slice(5));
    }
    break;
  case "LOG":
    console.log(GREEN, "Bob's log:");
    bobSay(env.LOG);
    break;
  case "PROXY":
    console.log(YELLOW, `Bob is proxying to ${msg}`);
    env.PROXY = Number(msg);
    env.SOCKET = net.Socket().connect(env.PROXY);
    break;
  default:
    console.log(RED, "PANIC PANIC PANIC, operator not handled");
    process.exit(1);
  }
}

// my server
net.createServer(function (socket) {
  let env = {
    LOG: [],
    PROXY: null,
    SOCKET: null,
  };
  socket.on("data", function (data) {
    const args = parseArgs(data, bobOperators);
    const [msg, op] = args;
    if (op) {
      handleOps(args, env, data);
    } else {
      console.log(data);
      bobHear(msg);
    }
    env.LOG.push(`${op}::${msg}`);
  });
}).listen(8081);
