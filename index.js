// index.js
const SimCardEmulator = require("./SimCardEmulator"); // تأكد من وجود هذا الملف بنفس المجلد

const simCard = new SimCardEmulator();

// Function to execute commands from command line arguments
function executeCommand(command, ...args) {
  switch (command) {
    case "sendUSSD":
      if (args.length < 2) {
        console.error("Error: Company and code are required.");
        return;
      }
      console.log(simCard.sendUSSD(args[0], args[1]));
      break;

    case "makeCall":
      if (args.length < 1) {
        console.error("Error: Phone number is required.");
        return;
      }
      console.log(simCard.makeCall(args[0]));
      break;

    case "sendSMS":
      if (args.length < 2) {
        console.error("Error: Phone number and message are required.");
        return;
      }
      console.log(simCard.sendSMS(args[0], args.slice(1).join(" ")));
      break;

    case "recharge":
      if (args.length < 1) {
        console.error("Error: Amount is required.");
        return;
      }
      console.log(simCard.recharge(parseFloat(args[0])));
      break;

    case "transfer":
      if (args.length < 1) {
        console.error("Error: Amount is required.");
        return;
      }
      console.log(simCard.transfer(parseFloat(args[0])));
      break;

    case "receiveSMS":
      if (args.length < 1) {
        console.error("Error: Message is required.");
        return;
      }
      console.log(simCard.receiveSMS(args.join(" ")));
      break;

    case "getBalance":
      console.log(`Current balance: ${simCard.getBalance()} DA`);
      break;

    default:
      console.error("Error: Unknown command.");
  }
}

// Read command line arguments
const [, , command, ...args] = process.argv;

if (command) {
  executeCommand(command, ...args);
} else {
  console.error("Error: No command provided.");
}
