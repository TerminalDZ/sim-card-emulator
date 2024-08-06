class SimCardEmulator {
  constructor(initialBalance = 100) {
    this.balance = initialBalance;
    this.messages = [];
    this.callHistory = [];
    this.ussdHistory = [];
  }

  sendUSSD(company, code) {
    const response = this._processUSSD(company, code);
    this.ussdHistory.push({ company, code, response, timestamp: new Date() });
    return response;
  }

  _processUSSD(company, code) {
    switch (company.toLowerCase()) {
      case "mobilise":
        if (code === "*661#") {
          return {
            status: "success",
            message: "Select: 1. Balance Transfer 2. Balance Inquiry",
          };
        }
        if (code.startsWith("1")) {
          return this._handleBalanceTransfer(code.slice(1));
        }
        if (code.startsWith("2")) {
          return this._handleBalanceInquiry();
        }
        break;

      case "ooredoo":
        if (code === "*200#") {
          return { status: "success", message: `Balance: ${this.balance} DA` };
        }
        break;

      default:
        return { status: "error", message: "Invalid company or code" };
    }
    return { status: "error", message: "Invalid code" };
  }

  _handleBalanceTransfer(input) {
    const [number, amount] = input.split(",");
    if (!number || isNaN(amount) || amount <= 0 || amount > this.balance) {
      return { status: "error", message: "Invalid transfer details" };
    }
    this.balance -= parseFloat(amount);
    return {
      status: "success",
      message: `Transferred ${amount} DA to ${number}. New balance: ${this.balance} DA`,
    };
  }

  _handleBalanceInquiry() {
    return {
      status: "success",
      message: `Your current balance is: ${this.balance} DA`,
    };
  }

  recharge(amount) {
    if (amount <= 0)
      return { status: "error", message: "Invalid recharge amount" };
    this.balance += amount;
    return {
      status: "success",
      message: `Recharged ${amount} DA. Your new balance is: ${this.balance} DA`,
    };
  }

  sendSMS(number, message) {
    if (message.trim() === "")
      return { status: "error", message: "Message content cannot be empty" };
    if (this.balance < 5)
      return { status: "error", message: "Insufficient balance to send SMS" };
    this.balance -= 5;
    this.messages.push({
      type: "sent",
      number,
      message,
      timestamp: new Date(),
    });
    return { status: "success", message: `Message sent to ${number}` };
  }

  makeCall(number) {
    if (number.trim() === "")
      return { status: "error", message: "Invalid phone number" };
    if (this.balance < 10)
      return {
        status: "error",
        message: "Insufficient balance to make a call",
      };
    this.balance -= 10;
    this.callHistory.push({ number, type: "outgoing", timestamp: new Date() });
    return {
      status: "success",
      message: `Calling ${number}. Remaining balance: ${this.balance} DA`,
    };
  }

  receiveSMS(number, message) {
    this.messages.push({
      type: "received",
      number,
      message,
      timestamp: new Date(),
    });
    return { status: "success", message: `Message received from ${number}` };
  }

  receiveCall(number) {
    this.callHistory.push({ number, type: "incoming", timestamp: new Date() });
    return { status: "success", message: `Incoming call from ${number}` };
  }

  getBalance() {
    return this.balance;
  }

  getMessages() {
    return this.messages;
  }

  getCallHistory() {
    return this.callHistory;
  }

  getUSSDHistory() {
    return this.ussdHistory;
  }
}

module.exports = SimCardEmulator;
