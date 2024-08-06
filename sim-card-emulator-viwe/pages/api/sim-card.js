import SimCardEmulator from "../../../SimCardEmulator";

const simCard = new SimCardEmulator();

export default function handler(req, res) {
  const { method } = req;
  const { company, action, number, message, amount, code } = req.body;
  const queryAction = req.query.action;

  try {
    switch (method) {
      case "POST":
        return handlePostRequest(
          action,
          { company, number, message, amount, code },
          res
        );
      case "GET":
        return handleGetRequest(queryAction, res);
      default:
        return res
          .status(405)
          .json({ status: "error", message: "Method not allowed" });
    }
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
}

function handlePostRequest(action, params, res) {
  const { company, number, message, amount, code } = params;

  switch (action) {
    case "sendUSSD":
      if (!company || !code) {
        return res
          .status(400)
          .json({ status: "error", message: "Missing company or code" });
      }
      return res.status(200).json({ result: simCard.sendUSSD(company, code) });
    case "sendSMS":
      if (!number || !message) {
        return res
          .status(400)
          .json({ status: "error", message: "Missing number or message" });
      }
      return res.status(200).json({ result: simCard.sendSMS(number, message) });
    case "makeCall":
      if (!number) {
        return res
          .status(400)
          .json({ status: "error", message: "Missing number" });
      }
      return res.status(200).json({ result: simCard.makeCall(number) });
    case "recharge":
      if (!amount) {
        return res
          .status(400)
          .json({ status: "error", message: "Missing amount" });
      }
      return res
        .status(200)
        .json({ result: simCard.recharge(parseFloat(amount)) });
    case "receiveSMS":
      if (!number || !message) {
        return res
          .status(400)
          .json({ status: "error", message: "Missing number or message" });
      }
      return res
        .status(200)
        .json({ result: simCard.receiveSMS(number, message) });
    case "receiveCall":
      if (!number) {
        return res
          .status(400)
          .json({ status: "error", message: "Missing number" });
      }
      return res.status(200).json({ result: simCard.receiveCall(number) });
    default:
      return res
        .status(400)
        .json({ status: "error", message: "Invalid action" });
  }
}

function handleGetRequest(action, res) {
  switch (action) {
    case "getBalance":
      return res
        .status(200)
        .json({ status: "success", balance: simCard.getBalance() });
    case "getMessages":
      return res
        .status(200)
        .json({ status: "success", messages: simCard.getMessages() });
    case "getCallHistory":
      return res
        .status(200)
        .json({ status: "success", callHistory: simCard.getCallHistory() });
    case "getUSSDHistory":
      return res
        .status(200)
        .json({ status: "success", ussdHistory: simCard.getUSSDHistory() });
    case "reset":
      simCard.reset();
      return res.status(200).json({
        status: "success",
        message: "SimCard Emulator reset successfully",
      });
    default:
      return res
        .status(400)
        .json({ status: "error", message: "Invalid action" });
  }
}
