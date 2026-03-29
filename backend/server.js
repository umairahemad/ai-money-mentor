const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// 🔥 FIRE
app.post("/fire", (req, res) => {
  const { age, retireAge, expenses, savings } = req.body;

  const years = retireAge - age;
  const target = expenses * 12 * 25;
  const sip = (target - savings) / (years * 12);

  res.json({
    target,
    sip,
    insight: sip > expenses * 0.5
      ? "⚠️ High SIP required"
      : "✅ Plan achievable"
  });
});

// ⚖️ TAX
app.post("/tax", (req, res) => {
  const { salary, deduction } = req.body;

  const taxOld = (salary - deduction) * 0.2;
  const taxNew = salary * 0.15;

  res.json({
    saving: Math.abs(taxOld - taxNew),
    best: taxOld < taxNew ? "OLD" : "NEW",
    insight: "Use ELSS & NPS"
  });
});

// 📊 PORTFOLIO
app.post("/portfolio", (req, res) => {
  const { value, ratio } = req.body;

  res.json({
    yearlyLoss: value * ratio / 100,
    lifetimeLoss: value * ratio * 10,
    insight: ratio > 1 ? "High fees" : "Good portfolio"
  });
});

// 👫 COUPLE (UPGRADED)
app.post("/couple", (req, res) => {
  const { income1, income2, rent, tax } = req.body;

  const total = income1 + income2;
  const invest = total * 0.3;
  const hra = rent * 0.4;

  res.json({
    total,
    split1: Math.round(invest * 0.6),
    split2: Math.round(invest * 0.4),
    insight: `You can save ₹${hra} using HRA optimization.`
  });
});

// 📅 LIFE (UPGRADED)
app.post("/life", (req, res) => {
  const { event, amount, savings } = req.body;

  let action = "";

  if (event === "baby") action = "Increase insurance + emergency fund";
  else if (event === "marriage") action = "Shift to safe assets";
  else if (event === "house") action = "Keep EMI < 30% income";
  else action = "Invest bonus into SIP";

  const gap = Math.max(amount - savings, 0);

  res.json({
    buffer: amount * 1.2,
    gap,
    action,
    insight: `You need ₹${gap} more to achieve this goal.`
  });
});

// 🏥 HEALTH (UPGRADED)
app.post("/health", (req, res) => {
  const { emergency, insurance, debt, income } = req.body;

  const emergencyScore = Math.min(emergency * 10, 50);
  const debtRatio = debt / income;
  const debtScore = debtRatio < 0.3 ? 30 : 10;

  const score = emergencyScore + insurance + debtScore;

  res.json({
    score,
    status:
      score > 70 ? "EXCELLENT" :
      score > 40 ? "AVERAGE" : "CRITICAL",
    insight:
      score < 50
        ? "⚠️ Improve savings and reduce debt"
        : "✅ Financial health is strong"
  });
});

// 🤖 CHAT (OLLAMA)
app.post("/chat", async (req, res) => {
  const { message } = req.body;

  try {
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        model: "llama3",
        prompt: `Financial advisor:\n${message}`,
        stream: false
      })
    });

    const data = await response.json();

    res.json({ reply: data.response });

  } catch {
    res.json({ reply: "⚠️ Start Ollama first" });
  }
});

app.listen(5000, () => console.log("🚀 Server running"));