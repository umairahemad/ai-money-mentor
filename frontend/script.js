let current = "fire";

// 🔹 LOAD MODULE UI
function loadModule(name, e) {
  current = name;

  document.querySelectorAll(".sidebar li").forEach(li => li.classList.remove("active"));
  if (e) e.target.classList.add("active");

  let html = "";

  if (name === "fire") {
    html = `
      <div class="card">
        <h2>🔥 FIRE Planner</h2>
        <div class="grid">
          <input id="age" placeholder="Age">
          <input id="retire" placeholder="Retirement Age">
          <input id="exp" placeholder="Monthly Expenses">
          <input id="save" placeholder="Savings">
        </div>
        <button onclick="callAPI()">Calculate</button>
      </div>
    `;
  }

  else if (name === "tax") {
    html = `
      <div class="card">
        <h2>⚖️ Tax Optimizer</h2>
        <input id="salary" placeholder="Salary">
        <input id="deduction" placeholder="Deductions">
        <button onclick="callAPI()">Optimize</button>
      </div>
    `;
  }

  else if (name === "portfolio") {
    html = `
      <div class="card">
        <h2>📊 Portfolio Analyzer</h2>
        <input id="value" placeholder="Portfolio Value">
        <input id="ratio" placeholder="Expense Ratio (%)">
        <button onclick="callAPI()">Analyze</button>
      </div>
    `;
  }

  else if (name === "couple") {
    html = `
      <div class="card">
        <h2>👫 Couple Planner</h2>
        <div class="grid">
          <input id="inc1" placeholder="Income Partner 1 (₹)">
          <input id="inc2" placeholder="Income Partner 2 (₹)">
          <input id="rent" placeholder="Monthly Rent (₹)">
          <input id="tax" placeholder="Tax Bracket (%)">
        </div>
        <button onclick="callAPI()">Optimize Plan</button>
      </div>
    `;
  }

  else if (name === "life") {
    html = `
      <div class="card">
        <h2>📅 Life Event Advisor</h2>
        <select id="event">
          <option value="bonus">💰 Bonus</option>
          <option value="marriage">💍 Marriage</option>
          <option value="baby">👶 Baby</option>
          <option value="house">🏠 Buying House</option>
        </select>
        <input id="amount" placeholder="Amount (₹)">
        <input id="savings" placeholder="Current Savings (₹)">
        <button onclick="callAPI()">Get Advice</button>
      </div>
    `;
  }

  else if (name === "health") {
    html = `
      <div class="card">
        <h2>🏥 Money Health Score</h2>
        <div class="grid">
          <input id="emergency" placeholder="Emergency Fund (months)">
          <input id="insurance" placeholder="Insurance Score (0-30)">
          <input id="debt" placeholder="Monthly Debt (₹)">
          <input id="income" placeholder="Monthly Income (₹)">
        </div>
        <button onclick="callAPI()">Analyze Health</button>
      </div>
    `;
  }

  document.getElementById("main").innerHTML = html;
}

// 🔹 API CALL
async function callAPI() {
  let url = "http://localhost:5000/" + current;
  let body = {};

  if (current === "fire") {
    body = {
      age: +age.value,
      retireAge: +retire.value,
      expenses: +exp.value,
      savings: +save.value
    };
  }

  else if (current === "tax") {
    body = {
      salary: +salary.value,
      deduction: +deduction.value
    };
  }

  else if (current === "portfolio") {
    body = {
      value: +value.value,
      ratio: +ratio.value
    };
  }

  else if (current === "couple") {
    body = {
      income1: +inc1.value,
      income2: +inc2.value,
      rent: +rent.value,
      tax: +tax.value
    };
  }

  else if (current === "life") {
    body = {
      event: event.value,
      amount: +amount.value,
      savings: +savings.value
    };
  }

  else if (current === "health") {
    body = {
      emergency: +emergency.value,
      insurance: +insurance.value,
      debt: +debt.value,
      income: +income.value
    };
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const data = await res.json();

    // 🎯 LABELS
    const labels = {
      fire: ["🎯 Target Corpus", "📈 Monthly SIP"],
      tax: ["💰 Tax Saving", "⚖️ Best Regime"],
      portfolio: ["💸 Yearly Loss", "📉 Lifetime Loss"],
      couple: ["💵 Total Income", "📊 Investment Split"],
      life: ["🎯 Goal Buffer", "⚡ Action Plan"],
      health: ["🧠 Health Score", "📊 Status"]
    };

    document.getElementById("label1").innerText = labels[current][0];
    document.getElementById("label2").innerText = labels[current][1];

    // 🎯 VALUE 1
    let val1Text =
      data.target || data.saving || data.yearlyLoss || data.total || data.buffer || data.score || "-";

    if (typeof val1Text === "number") {
      val1Text = "₹ " + val1Text.toLocaleString();
    }

    document.getElementById("val1").innerText = val1Text;

    // 🎯 VALUE 2 (SAFE)
    let rawVal2 = "-";

    if (current === "fire") rawVal2 = data.sip;
    else if (current === "tax") rawVal2 = data.best;
    else if (current === "portfolio") rawVal2 = data.lifetimeLoss;
    else if (current === "couple") rawVal2 = data.split1;
    else if (current === "life") rawVal2 = data.action;
    else if (current === "health") rawVal2 = data.status;

    const shortVal2 =
      typeof rawVal2 === "string" && rawVal2.length > 35
        ? rawVal2.slice(0, 35) + "..."
        : rawVal2;

    const val2El = document.getElementById("val2");
    val2El.innerText = shortVal2;
    val2El.title = rawVal2;

    // 🧠 INSIGHT
    document.getElementById("note").innerText =
      data.insight || data.message || "AI insights will appear here";

    // 🚀 GLOBAL SCORE
    let score = 0;

    if (current === "fire") {
      const ratio = +save.value / ((+exp.value || 1) * 12);
      score = Math.min(ratio * 100, 100);
    }
    else if (current === "tax") score = data.saving > 50000 ? 80 : 50;
    else if (current === "portfolio") score = data.yearlyLoss < 5000 ? 80 : 40;
    else if (current === "couple") score = (+inc1.value + +inc2.value) > 100000 ? 85 : 60;
    else if (current === "life") score = data.gap === 0 ? 90 : 50;
    else if (current === "health") score = data.score || 0;

    score = Math.min(Math.max(score, 0), 100);

    const scoreBar = document.getElementById("scoreFill");
    scoreBar.style.width = score + "%";

    if (score > 70) scoreBar.style.background = "#22c55e";
    else if (score > 40) scoreBar.style.background = "#facc15";
    else scoreBar.style.background = "#ef4444";

    document.getElementById("scoreText") &&
      (document.getElementById("scoreText").innerText = Math.round(score));

  } catch (err) {
    console.error(err);
    alert("❌ Backend not running");
  }
}

// 🤖 CHAT
async function sendChat() {
  const msg = document.getElementById("chatInput").value;

  try {
    const res = await fetch("http://localhost:5000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg })
    });

    const data = await res.json();
    document.getElementById("chatReply").innerText = data.reply || "No response";

  } catch {
    document.getElementById("chatReply").innerText =
      "⚠️ AI not working. Start Ollama.";
  }
}

// LOAD DEFAULT
loadModule("fire");