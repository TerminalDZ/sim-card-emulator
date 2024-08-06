import React, { useState, useEffect } from "react";
import {
  Container,
  Form,
  Button,
  Alert,
  Tabs,
  Tab,
  Table,
  Row,
  Col,
} from "react-bootstrap";

export default function Home() {
  const [action, setAction] = useState("");
  const [company, setCompany] = useState("");
  const [params, setParams] = useState({
    number: "",
    message: "",
    amount: "",
    code: "",
  });
  const [result, setResult] = useState(null);
  const [balance, setBalance] = useState(0);
  const [messages, setMessages] = useState([]);
  const [callHistory, setCallHistory] = useState([]);
  const [ussdHistory, setUSSDHistory] = useState([]);

  useEffect(() => {
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    try {
      const res = await fetch("/api/sim-card?action=getBalance");
      const data = await res.json();
      if (data.status === "success") {
        setBalance(data.balance);
      }
    } catch (error) {
      console.error("خطأ في جلب الرصيد:", error);
    }
  };

  const handleSubmit = async (e, action) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/sim-card`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company, action, ...params }),
      });
      const data = await res.json();
      setResult(data);
      fetchBalance();
      setParams({ number: "", message: "", amount: "", code: "" });
    } catch (error) {
      setResult({ status: "error", message: error.message });
    }
  };

  const fetchData = async (action) => {
    try {
      const res = await fetch(`/api/sim-card?action=${action}`);
      const data = await res.json();
      if (data.status === "success") {
        switch (action) {
          case "getMessages":
            setMessages(data.messages || []);
            break;
          case "getCallHistory":
            setCallHistory(data.callHistory || []);
            break;
          case "getUSSDHistory":
            setUSSDHistory(data.ussdHistory || []);
            break;
        }
      }
    } catch (error) {
      console.error(`خطأ في جلب ${action}:`, error);
    }
  };

  return (
    <Container className="mt-5">
      <h1>محاكي بطاقة SIM</h1>
      <Alert variant="info">الرصيد الحالي: {balance} دينار</Alert>

      <Tabs defaultActiveKey="actions" className="mb-3">
        <Tab eventKey="actions" title="الإجراءات">
          <Row>
            <Col md={6}>
              <h3>إرسال USSD</h3>
              <Form onSubmit={(e) => handleSubmit(e, "sendUSSD")}>
                <Form.Group className="mb-3">
                  <Form.Label>الشركة</Form.Label>
                  <Form.Control
                    as="select"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    required
                  >
                    <option value="">اختر الشركة</option>
                    <option value="mobilise">Mobilise</option>
                    <option value="ooredoo">Ooredoo</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>كود USSD</Form.Label>
                  <Form.Control
                    type="text"
                    value={params.code}
                    onChange={(e) =>
                      setParams({ ...params, code: e.target.value })
                    }
                    required
                  />
                </Form.Group>
                <Button type="submit">إرسال USSD</Button>
              </Form>
            </Col>
            <Col md={6}>
              <h3>إرسال رسالة SMS</h3>
              <Form onSubmit={(e) => handleSubmit(e, "sendSMS")}>
                <Form.Group className="mb-3">
                  <Form.Label>رقم الهاتف</Form.Label>
                  <Form.Control
                    type="text"
                    value={params.number}
                    onChange={(e) =>
                      setParams({ ...params, number: e.target.value })
                    }
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>الرسالة</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={params.message}
                    onChange={(e) =>
                      setParams({ ...params, message: e.target.value })
                    }
                    required
                  />
                </Form.Group>
                <Button type="submit">إرسال SMS</Button>
              </Form>
            </Col>
          </Row>
          <Row className="mt-4">
            <Col md={6}>
              <h3>إجراء مكالمة</h3>
              <Form onSubmit={(e) => handleSubmit(e, "makeCall")}>
                <Form.Group className="mb-3">
                  <Form.Label>رقم الهاتف</Form.Label>
                  <Form.Control
                    type="text"
                    value={params.number}
                    onChange={(e) =>
                      setParams({ ...params, number: e.target.value })
                    }
                    required
                  />
                </Form.Group>
                <Button type="submit">إجراء مكالمة</Button>
              </Form>
            </Col>
            <Col md={6}>
              <h3>شحن الرصيد</h3>
              <Form onSubmit={(e) => handleSubmit(e, "recharge")}>
                <Form.Group className="mb-3">
                  <Form.Label>المبلغ</Form.Label>
                  <Form.Control
                    type="number"
                    value={params.amount}
                    onChange={(e) =>
                      setParams({ ...params, amount: e.target.value })
                    }
                    required
                  />
                </Form.Group>
                <Button type="submit">شحن الرصيد</Button>
              </Form>
            </Col>
          </Row>
          <Row className="mt-4">
            <Col md={6}>
              <h3>استقبال رسالة SMS</h3>
              <Form onSubmit={(e) => handleSubmit(e, "receiveSMS")}>
                <Form.Group className="mb-3">
                  <Form.Label>رقم المرسل</Form.Label>
                  <Form.Control
                    type="text"
                    value={params.number}
                    onChange={(e) =>
                      setParams({ ...params, number: e.target.value })
                    }
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>الرسالة</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={params.message}
                    onChange={(e) =>
                      setParams({ ...params, message: e.target.value })
                    }
                    required
                  />
                </Form.Group>
                <Button type="submit">استقبال SMS</Button>
              </Form>
            </Col>
            <Col md={6}>
              <h3>استقبال مكالمة</h3>
              <Form onSubmit={(e) => handleSubmit(e, "receiveCall")}>
                <Form.Group className="mb-3">
                  <Form.Label>رقم المتصل</Form.Label>
                  <Form.Control
                    type="text"
                    value={params.number}
                    onChange={(e) =>
                      setParams({ ...params, number: e.target.value })
                    }
                    required
                  />
                </Form.Group>
                <Button type="submit">استقبال مكالمة</Button>
              </Form>
            </Col>
          </Row>
          {result && (
            <Alert
              variant={result.status === "success" ? "success" : "danger"}
              className="mt-3"
            >
              <h4>{result.status === "success" ? "نجاح" : "خطأ"}</h4>
              <p>{result.message}</p>
            </Alert>
          )}
        </Tab>

        <Tab
          eventKey="messages"
          title="الرسائل"
          onEnter={() => fetchData("getMessages")}
        >
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>النوع</th>
                <th>رقم الهاتف</th>
                <th>الرسالة</th>
                <th>الوقت</th>
              </tr>
            </thead>
            <tbody>
              {messages &&
                messages.map((msg, index) => (
                  <tr key={index}>
                    <td>{msg.type}</td>
                    <td>{msg.number}</td>
                    <td>{msg.message}</td>
                    <td>{new Date(msg.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </Tab>

        <Tab
          eventKey="callHistory"
          title="Call History"
          onEnter={() => fetchData("getCallHistory")}
        >
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Type</th>
                <th>Number</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {callHistory &&
                callHistory.map((call, index) => (
                  <tr key={index}>
                    <td>{call.type}</td>
                    <td>{call.number}</td>
                    <td>{new Date(call.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </Tab>

        <Tab
          eventKey="ussdHistory"
          title="USSD History"
          onEnter={() => fetchData("getUSSDHistory")}
        >
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Company</th>
                <th>Code</th>
                <th>Response</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {ussdHistory &&
                ussdHistory.map((ussd, index) => (
                  <tr key={index}>
                    <td>{ussd.company}</td>
                    <td>{ussd.code}</td>
                    <td>{ussd.response.message}</td>
                    <td>{new Date(ussd.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </Tab>
      </Tabs>
    </Container>
  );
}
