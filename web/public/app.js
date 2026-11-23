const SCENARIOS = [
  { id: "investment", name: "Investment scam, 4th deposit", persona: "Kamla, 68, Lucknow (fictional)", senior: "Kamla", relation: "Mummy", contactName: "Asha", payee: "Alpha Wealth Desk", truth: "Scam", c: { amount: 40000, median: 750, prior_n: 3, last_amt: 18000, consec: 3, cum14: 31000, age: 11, call: 0, reports: 0, hour: 16, balance: 480000 } },
  { id: "normal", name: "Normal grocery payment", persona: "Kamla, 68, Lucknow (fictional)", senior: "Kamla", relation: "Mummy", contactName: "Asha", payee: "Gupta Kirana", truth: "Legitimate", c: { amount: 640, median: 700, prior_n: 24, last_amt: 710, consec: 0, cum14: 1400, age: 150, call: 0, reports: 0, hour: 10, balance: 480000 } },
  { id: "arrest", name: "Digital arrest scam", persona: "Mohan, 72, Jaipur (fictional)", senior: "Mohan", relation: "Papa", contactName: "Rohit", payee: "Case Settlement A/C", truth: "Scam", c: { amount: 200000, median: 1000, prior_n: 0, last_amt: 0, consec: 0, cum14: 0, age: 0, call: 1, reports: 0, hour: 14, balance: 800000 } },
  { id: "kyc", name: "Fake KYC update", persona: "Lata, 65, Indore (fictional)", senior: "Lata", relation: "Mummy", contactName: "Neha", payee: "KYC Verify Services", truth: "Scam", c: { amount: 4999, median: 700, prior_n: 0, last_amt: 0, consec: 0, cum14: 0, age: 0, call: 1, reports: 1, hour: 11, balance: 350000 } },
  { id: "hospital", name: "Safe but unusual: hospital bill", persona: "Mohan, 72, Jaipur (fictional)", senior: "Mohan", relation: "Papa", contactName: "Rohit", payee: "City Care Hospital", truth: "Legitimate", c: { amount: 45000, median: 900, prior_n: 0, last_amt: 0, consec: 0, cum14: 0, age: 0, call: 1, reports: 0, hour: 14, balance: 600000 } },
];
const ICONS = {
  shield: '<path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z"/><path d="M9 12l2 2 4-4"/>', back: '<path d="M19 12H5M11 6l-6 6 6 6"/>', chev: '<path d="M9 6l6 6-6 6"/>',
  qr: '<rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><path d="M14 14h3v3M20 14v6h-6"/>', people: '<circle cx="9" cy="8" r="3.500"/><path d="M3 20c.5-4 3-6 6-6s5.500 2 6 6"/><path d="M16 5a3.500 3.500 0 010 6.500M18 14c2 .8 3 3 3.300 6"/>',
  phone: '<path d="M6 3h3l2 5-2.500 1.500a12 12 0 006 6L16 13l5 2v3a3 3 0 01-3 3C10 21 3 14 3 6a3 3 0 013-3z"/>', bank: '<path d="M3 10l9-6 9 6zM5 10v8M10 10v8M14 10v8M19 10v8M3 20h18"/>', at: '<circle cx="12" cy="12" r="3.500"/><path d="M15.500 8.500V14a2.500 2.500 0 005 0v-2a8.500 8.500 0 10-3.500 6.900"/>', swap: '<path d="M4 8h15M15 4l4 4-4 4M20 16H5M9 12l-4 4 4 4"/>', bill: '<path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 12h6"/>', mobile: '<rect x="7" y="3" width="10" height="18" rx="2"/><path d="M11 18h2"/>',
  search: '<circle cx="11" cy="11" r="6.500"/><path d="M16 16l4.500 4.500"/>', check: '<path d="M5 12.500l4.500 4.500L19 7.500"/>', lock: '<rect x="5" y="10.500" width="14" height="10" rx="2.500"/><path d="M8 10.500V8a4 4 0 018 0v2.500"/>', bell: '<path d="M6 16V11a6 6 0 0112 0v5l2 2H4z"/><path d="M10 21h4"/>', clock: '<circle cx="12" cy="12" r="8.500"/><path d="M12 7v5l3 2"/>',
};
const ic = (name, size = 22) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name]}</svg>`;
const googleG = (size = 20) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" role="img" aria-label="Google"><path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"/><path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"/><path fill="#FBBC05" d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"/><path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z"/></svg>`;
const wordmark = (size = 20) => `${googleG(size)}<span>Pay</span>`;
const inr = (n) => "₹" + Number(n).toLocaleString("en-IN");
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
const TONES = ["#1a73e8", "#ea4335", "#34a853", "#f29900", "#9334e6", "#129eaf"];
const avatar = (name, size = 50) => `<span class="av" style="width:${size}px;height:${size}px;font-size:${Math.round(size * .4)}px;background:${TONES[[...name].reduce((s, c) => s + c.charCodeAt(0), 0) % TONES.length]}" aria-hidden="true">${esc(name[0])}</span>`;
const statusBar = `<div class="status"><span>9:41</span><span class="island"></span><span class="sig" aria-hidden="true"><svg width="17" height="12" viewBox="0 0 17 12" fill="currentColor"><rect y="8" width="3" height="4" rx="1"/><rect x="4.500" y="5" width="3" height="7" rx="1"/><rect x="9" y="2.500" width="3" height="9.500" rx="1"/><rect x="13.500" width="3" height="12" rx="1"/></svg><svg width="24" height="12" viewBox="0 0 24 12" fill="none"><rect x=".5" y=".5" width="20" height="11" rx="3" stroke="currentColor"/><rect x="2" y="2" width="15" height="8" rx="1.500" fill="currentColor"/><rect x="22" y="4" width="1.500" height="4" rx=".7" fill="currentColor"/></svg></span></div>`;
const shell = (body, bottom = "") => `${statusBar}<div class="screen">${body}</div>${bottom}<div class="homebar"></div>`;
const full = (body) => `${statusBar}${body}<div class="homebar"></div>`;
const scanBar = `<div class="scanbar"><button class="inert">${ic("qr", 18)} Scan any QR code</button></div>`;
const hot = (active, label) => active ? { cls: "hot", hint: `<span class="hint">${label}</span>` } : { cls: "", hint: "" };
const backRow = (title, act) => `<div class="appback"><button class="iconbtn" data-act="${act}" aria-label="Back to Home">${ic("back")}</button>${esc(title)}</div>`;

let model, metrics, scenario = SCENARIOS[0], state, timer, toastTimer, run = 0;

function fresh() { clearInterval(timer); run++; state = { senior: "home", contact: "home", result: null, copy: null, wait: 10, note: "", outcome: "", event: "", toast: "", toastOn: "" }; render(); }

function stepIndex() {
  if (state.event && state.senior === "home") return 5;
  if (["sent", "cancelled"].includes(state.senior)) return 5;
  if (state.senior === "pause") return state.contact === "alert" ? 3 : 4;
  if (state.senior === "pay") return 1;
  return 0;
}
function hotTarget() {
  if (state.senior === "home" && !state.event) return "person";
  if (state.senior === "pay") return "pay";
  if (state.senior === "pause" && state.contact === "alert") return "call";
  if (state.senior === "pause" && state.contact === "call") return "warn";
  if (state.senior === "pause" && state.note) return "cancel";
  if (["sent", "cancelled"].includes(state.senior)) return "home";
  if (state.senior === "home" && state.event) return "card";
  return "";
}

function tick() {
  state.wait--;
  if (state.wait <= 0) clearInterval(timer);
  const button = document.querySelector('[data-act="proceed"]');
  if (button) { button.disabled = state.wait > 0; button.textContent = state.wait > 0 ? `Pay anyway in ${state.wait}s` : "I understand, pay anyway"; }
}

async function pay() {
  const thisRun = run, result = SaathiScore.score(model, scenario.c);
  state.result = result;
  if (!result.flagged) { state.senior = "sent"; state.event = "normal"; render(); return; }
  state.copy = SaathiScore.templateCopy(scenario.c, scenario.relation);
  state.senior = "pause"; state.contact = "alert"; render();
  timer = setInterval(tick, 1000);
  try {
    const res = await fetch("/api/explain", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ amount: scenario.c.amount, reasons: result.reasons, relation: scenario.relation }) });
    if (res.ok && thisRun === run) { state.copy = await res.json(); render(); }
  } catch { /* The written template stays on screen. */ }
}

function saathiCard(forContact) {
  const flaggedEvent = state.event === "stopped" || state.event === "continued";
  const title = flaggedEvent ? "Saathi checked a payment" : forContact ? `Protecting ${scenario.relation}` : "Saathi family safety";
  const detail = state.event === "stopped" ? "Payment was stopped today" : state.event === "continued" ? "Payment went ahead today" : forContact ? "You only hear about risky payments" : `On. ${scenario.contactName} is your trusted contact`;
  const h = hot(!forContact && hotTarget() === "card", "Open Saathi");
  return `<button class="saathi-card ${flaggedEvent ? "alert" : ""} ${h.cls}" data-act="${forContact ? "contact-saathi" : "saathi"}">${h.hint}<span class="shieldico">${ic("shield")}</span><span><b>${title}</b>${flaggedEvent ? "" : '<span class="badge">NEW</span>'}<small>${detail}</small></span><span class="chev">${ic("chev", 18)}</span></button>`;
}

function homeView(user, forContact) {
  const actions = [["qr", "Scan any QR code"], ["people", "Pay contacts"], ["phone", "Pay phone number"], ["bank", "Bank transfer"], ["at", "Pay UPI ID"], ["swap", "Self transfer"], ["bill", "Pay bills"], ["mobile", "Mobile recharge"]];
  const names = forContact ? [scenario.senior, "Meera", "Karan", "Dev"] : [scenario.payee, scenario.contactName, "Dr. Mehta", "Milk Dairy"];
  const h = hot(!forContact && hotTarget() === "person", "Tap to pay");
  const people = names.map((n, i) => i === 0 && !forContact ? `<button class="person ${h.cls}" data-act="open-pay" aria-label="Pay ${esc(n)}">${h.hint}${avatar(n)}<span>${esc(n)}</span></button>` : `<button class="person inert">${avatar(n)}<span>${esc(n)}</span></button>`).join("");
  return shell(`<div class="home-top"><span class="wordmark">${wordmark(20)}</span><div class="searchbar">${ic("search", 17)}<span>Pay anyone on UPI</span></div>${avatar(user, 34)}</div><div class="grid">${actions.map(([icon, text]) => `<button class="tile inert"><i>${ic(icon, 21)}</i>${text}</button>`).join("")}</div>${saathiCard(forContact)}<div class="label">People</div><div class="people">${people}</div><div class="label">Manage your money</div><button class="listrow inert" style="border-width:0 0 1px;border-radius:0;background:none;min-height:0;font-weight:400;width:100%">${ic("clock", 19)}See transaction history</button><button class="listrow inert" style="border-width:0 0 1px;border-radius:0;background:none;min-height:0;font-weight:400;width:100%">${ic("bank", 19)}Check bank balance</button>${state.toast && state.toastOn === (forContact ? "contact" : "senior") ? `<div class="toast">${esc(state.toast)}</div>` : ""}`, scanBar);
}

function saathiHub() {
  const history = state.event === "stopped" || state.event === "continued" ? `<div class="box warn"><b>${inr(scenario.c.amount)} to ${esc(scenario.payee)}</b><div class="small">${state.event === "stopped" ? "You stopped this payment." : "You chose to continue."} ${esc(scenario.contactName)} was alerted.</div></div>` : `<div class="box">No risky payments so far.</div>`;
  return shell(`${backRow("Saathi family safety", "go-home")}<span class="pill">${ic("shield", 14)} On</span><div class="row">${avatar(scenario.contactName, 48)}<div><b style="font-weight:500">${esc(scenario.contactName)}</b><div class="muted small">Your trusted contact</div></div></div><div class="label">Recent checks</div>${history}<div class="label">What ${esc(scenario.contactName)} can see</div><div class="row small">${ic("bell", 19)}Only payments that look risky</div><div class="row small">${ic("lock", 19)}Never your balance or everyday payments</div><div class="row small">${ic("check", 19)}You always make the final decision</div>`);
}

function seniorView() {
  const c = scenario.c, target = hotTarget();
  if (state.senior === "home") return ["plain", homeView(scenario.senior, false)];
  if (state.senior === "saathi") return ["plain", saathiHub()];
  if (state.senior === "pay") {
    const h = hot(target === "pay", "Tap to see Saathi");
    return ["plain", shell(`${backRow("Pay", "go-home")}<div style="display:grid;justify-items:center;gap:7px;text-align:center;margin-top:24px">${avatar(scenario.payee, 76)}<div style="font-size:19px;font-weight:500">Paying ${esc(scenario.payee)}</div><div class="muted small">${c.prior_n ? `Paid ${c.prior_n} times before` : "First payment to this payee"}</div><div class="amount" style="margin-top:22px">${inr(c.amount)}</div></div><div class="row small muted" style="justify-content:center;margin-top:10px">${ic("shield", 17)}Protected by Saathi</div><div class="actions"><button class="primary ${h.cls}" data-act="pay">${h.hint}Pay ${inr(c.amount)}</button></div>`)];
  }
  if (state.senior === "pause") {
    const h = hot(target === "cancel", "Decide here");
    return ["pause", shell(`<div class="pausehead"><span class="pill warn">${ic("shield", 14)} Saathi safety pause</span><h3>रुकिए, पहले एक बार जाँच लें</h3><div class="row">${avatar(scenario.payee, 34)}<div><b style="font-weight:500">${inr(c.amount)}</b> <span class="muted">to ${esc(scenario.payee)}</span></div></div></div><div class="box warn hi">${esc(state.copy.senior_hi)}</div><div class="muted">${esc(state.copy.senior_en)}</div>${state.note ? `<div class="box"><b style="font-weight:500">${esc(scenario.contactName)}:</b> ${esc(state.note)}</div>` : `<div class="row muted small">${avatar(scenario.contactName, 26)}${esc(scenario.contactName)} has been told about this payment.</div>`}<div class="actions"><button class="primary ${h.cls}" data-act="cancel">${h.hint}Don't pay, I'll talk first</button><button class="secondary" data-act="proceed" ${state.wait > 0 ? "disabled" : ""}>${state.wait > 0 ? `Pay anyway in ${state.wait}s` : "I understand, pay anyway"}</button></div>`)];
  }
  const sent = state.senior === "sent", h = hot(target === "home", "Saathi stays on Home");
  const copy = sent ? ["Payment sent", `${inr(c.amount)} to ${scenario.payee}`, state.result?.flagged ? "You chose to continue. Saathi never blocks your decision." : "Saathi stayed quiet. Nothing changed and no one was notified."] : ["Payment stopped", "Your money has not moved.", "If you already lost money, call 1930 or visit cybercrime.gov.in."];
  return ["plain", shell(`<div class="bigicon ${sent ? "" : "blue"}">${ic(sent ? "check" : "shield", 38)}</div><h3 class="title" style="text-align:center">${esc(copy[0])}</h3><div style="text-align:center">${esc(copy[1])}</div><div class="box">${esc(copy[2])}</div><div class="actions"><button class="primary ${h.cls}" data-act="go-home">${h.hint}Back to Google Pay Home</button></div>`)];
}

function contactView() {
  const r = scenario.relation, target = hotTarget();
  if (state.contact === "home") return ["plain", homeView(scenario.contactName, true)];
  if (state.contact === "saathi") return ["plain", shell(`${backRow("Saathi family safety", "contact-home")}<div class="row">${avatar(scenario.senior, 54)}<div><b style="font-weight:500">${esc(r)}</b><div class="muted small">${esc(scenario.persona)}</div></div></div><div class="box">${state.outcome ? esc(state.outcome) : "No alerts right now."}</div><div class="label">What you can see</div><div class="row small">${ic("bell", 19)}Only payments that look risky</div><div class="row small">${ic("lock", 19)}Never balance or everyday payments</div><div class="row small">${ic("phone", 19)}You can call, but never block a payment</div>`)];
  if (state.contact === "alert") { const h = hot(target === "call", "Family gets this alert"); return ["lock", full(`<div class="lock"><div class="clock">9:41</div><div class="date">Tuesday, 24 November</div><div class="notif"><div class="row"><span class="wordmark" style="font-size:15px">${wordmark(18)}</span><span class="muted small" style="margin-left:auto">now</span></div><b style="font-size:18px;font-weight:500">Saathi: ${esc(r)} may need you</b><div class="amount">${inr(scenario.c.amount)}</div><div class="small">${esc(state.copy.contact_en)}</div><div class="muted small">${esc(state.copy.contact_hi)}</div></div><div class="actions"><button class="primary ${h.cls}" data-act="call">${h.hint}Call ${esc(r)}</button></div></div>`)]; }
  if (state.contact === "call") { const h = hot(target === "warn", "Advise, never block"); return ["call", full(`<div class="callscreen">${avatar(scenario.senior, 104)}<h3 class="title" style="margin-top:12px">${esc(r)}</h3><div>Calling…</div><div class="small" style="opacity:.85;margin-top:14px">You can advise, but you cannot approve or block this payment.</div><div class="actions"><button class="primary ${h.cls}" data-act="warn">${h.hint}Tell ${esc(r)}: please stop</button><button class="secondary" data-act="fine">Tell ${esc(r)}: this is OK</button></div></div>`)]; }
  return ["plain", shell(`<div class="bigicon blue">${ic("shield", 38)}</div><h3 class="title" style="text-align:center;font-size:23px">${esc(state.outcome || `${r} can see your note`)}</h3>${state.note ? `<div class="box">Your note: ${esc(state.note)}</div>` : ""}<div class="muted" style="text-align:center">${state.outcome ? `The decision was made by ${esc(r)}.` : `The final choice stays with ${esc(r)}.`}</div><div class="actions"><button class="secondary" data-act="contact-home">Back to Google Pay Home</button></div>`)];
}

function guideView() {
  const steps = [
    ["Start on Google Pay Home", "Saathi is already built in. Tap the highlighted person to pay."],
    ["Make a payment", "It feels like any normal Google Pay payment. Tap Pay."],
    ["Risk check runs", "Normal payments continue. Risky ones trigger Saathi."],
    ["Pause and family alert", "The senior sees a pause. The trusted contact gets an alert. Tap Call."],
    ["Family helps, senior decides", "Send advice, then choose on the senior's phone."],
    ["Back on Home", "Saathi stays visible on Home. Tap its card to review what happened."],
  ];
  const now = stepIndex();
  return `<h2>How Saathi works inside Google Pay</h2><p>Follow the pulsing “tap” labels on the phones.</p><div class="controls"><label>Choose a simulated story<select id="scenario">${SCENARIOS.map((s) => `<option value="${s.id}" ${s.id === scenario.id ? "selected" : ""}>${s.name}</option>`).join("")}</select></label><button id="reset">Restart</button></div><ol class="steps">${steps.map(([title, text], i) => `<li class="${i === now ? "now" : i < now ? "past" : ""}"><span class="n">${i < now ? "✓" : i + 1}</span><span><b>${title}</b>${i === now ? text : ""}</span></li>`).join("")}</ol>`;
}

function whyView() {
  if (!state.result) return `<b>Behind the scenes:</b> pressing Pay runs the risk model in this browser. Ground truth for this simulated case: ${esc(scenario.truth)}.`;
  const reasons = state.result.reasons.map((r) => r.replaceAll("_", " ")).join(", ") || "none";
  const correct = state.result.flagged === (scenario.truth === "Scam");
  const source = state.copy ? (state.copy.source === "gemini" ? "generated by Gemini" : "written template, Gemini not connected") : "not needed";
  return `<b>Risk score ${(state.result.probability * 100).toFixed(1)}%</b>, pause threshold ${(model.threshold * 100).toFixed(1)}%. Signals: ${esc(reasons)}. Decision: ${state.result.flagged ? "pause" : "no pause"}. Ground truth: ${esc(scenario.truth)}${correct ? "." : ", so this is a false alarm that the family loop has to absorb."} Message: ${source}.`;
}

function paint(id, [mode, html]) { $(id).dataset.mode = mode; $(id).innerHTML = html; }
function render() {
  paint("senior", seniorView()); paint("contact", contactView()); $("why").innerHTML = whyView(); $("guide").innerHTML = guideView();
  $("scenario").onchange = (e) => { scenario = SCENARIOS.find((s) => s.id === e.target.value); fresh(); };
  $("reset").onclick = fresh;
  $("live").textContent = `Senior: ${state.senior}. Trusted contact: ${state.contact}.`;
}

function openTab(name) { document.querySelectorAll("[data-tab]").forEach((b) => { b.setAttribute("aria-selected", b.dataset.tab === name); $(b.dataset.tab).hidden = b.dataset.tab !== name; }); }

document.addEventListener("click", (e) => {
  const tab = e.target.closest("[data-tab]");
  if (tab) return openTab(tab.dataset.tab);
  const inert = e.target.closest(".inert");
  if (inert && inert.closest("#demo")) {
    state.toast = "This option isn't part of this walkthrough."; state.toastOn = inert.closest("#contact") ? "contact" : "senior"; render();
    clearTimeout(toastTimer); toastTimer = setTimeout(() => { state.toast = ""; render(); }, 1800);
    return;
  }
  const act = e.target.closest("[data-act]")?.dataset.act;
  if (!act) return;
  if (act === "pay") return void pay();
  if (act === "open-pay") state.senior = "pay";
  if (act === "saathi") state.senior = "saathi";
  if (act === "go-home") state.senior = "home";
  if (act === "contact-saathi") state.contact = "saathi";
  if (act === "contact-home") state.contact = "home";
  if (act === "cancel" || act === "proceed") { clearInterval(timer); state.senior = act === "cancel" ? "cancelled" : "sent"; state.event = act === "cancel" ? "stopped" : "continued"; state.contact = "done"; state.outcome = act === "cancel" ? "The payment was stopped." : "The payment went ahead."; }
  if (act === "call") state.contact = "call";
  if (act === "warn") { state.contact = "done"; state.note = "Please stop. This looks like a scam."; }
  if (act === "fine") { state.contact = "done"; state.note = "I checked. This payment is OK."; }
  render();
});

function gallery() {
  const screens = [
    ["Step 1 of 3", "shield", "Add a family safety check?", "If a payment looks like a scam, someone you trust can be told. This is your choice.", ["Set up Saathi", "Not now"]],
    ["Step 2 of 3", "people", "Who should we alert?", "Choose one person. They must accept your invitation before anything is shared.", ["Asha (daughter)", "Choose someone else"]],
    ["Step 3 of 3", "lock", "What they can see", "Only risky payments: the amount and why it looks risky. Never your balance or everyday payments.", ["I agree, turn on", "Go back"]],
    ["Trusted contact", "bell", "Mummy invited you", "You can call and advise. You cannot see normal payments, approve, or block anything.", ["Accept", "Decline"]],
    ["Google Pay settings", "shield", "Privacy and control", "Trusted contact: Asha. Alerts sent: 2. You can see every alert sent about you.", ["Change contact", "Turn off Saathi"]],
  ];
  $("gallery").innerHTML = screens.map(([tag, icon, title, body, buttons]) => `<div class="phone" data-mode="plain">${shell(`<div class="wordmark">${wordmark(20)}</div><span class="pill">${tag}</span><span class="shieldico" style="background:var(--blue-soft)">${ic(icon)}</span><h3 class="title">${title}</h3><div class="box">${body}</div><div class="actions"><button class="primary" tabindex="-1">${buttons[0]}</button><button class="secondary" tabindex="-1">${buttons[1]}</button></div>`)}</div>`).join("");
}

function evaluation() {
  const p = (x) => (x * 100).toFixed(1) + "%", t = metrics.test, s = metrics.handwritten_scenarios;
  const row = (name, m) => `<tr><td>${name}</td><td>${p(m.precision)}</td><td>${p(m.recall)}</td><td>${p(m.false_positive_rate)}</td><td>${p(m.rupee_recall)}</td></tr>`;
  const head = "<tr><th>Approach</th><th>Precision</th><th>Recall</th><th>False alarms</th><th>Scam ₹ flagged</th></tr>";
  $("eval").innerHTML = `<div class="callout"><b>Read this first:</b> these numbers come from simulated data, so they do not estimate real-world fraud detection.</div>
  <h2 class="section">Simulated test set</h2><p class="muted">${metrics.dataset.test_seniors} held-out synthetic seniors, ${t.logistic_regression.tp + t.logistic_regression.fn} scam payments.</p><div class="tablewrap"><table>${head}${row("Rules baseline", t.rules_baseline)}${row("Logistic regression (used)", t.logistic_regression)}${row("Gradient boosting", t.gradient_boosting)}</table></div>
  <h2 class="section">${s.n} hand-written hard cases</h2><p class="muted">Never used for training or threshold selection. The model catches more scams here but also raises more false alarms than the rules.</p><div class="tablewrap"><table>${head}${row("Rules baseline", s.rules_baseline)}${row("Logistic regression", s.model)}</table></div>
  <h2 class="section">Recall on a scam type removed from training</h2><div class="tablewrap"><table><tr><th>Held-out type</th><th>Test payments</th><th>Recall</th></tr>${Object.entries(metrics.unseen_scam_type_recall).map(([k, v]) => `<tr><td>${k.replaceAll("_", " ")}</td><td>${v.n}</td><td>${p(v.recall)}</td></tr>`).join("")}</table></div>
  <h2 class="section">Precision if real scams were rarer</h2><p class="muted">Calculated from the test recall and false-alarm rate. Real prevalence among seniors is unknown.</p><div class="tablewrap"><table><tr><th>Assumed scam share of payments</th><th>Precision</th></tr>${Object.entries(metrics.precision_if_real_prevalence_were).map(([k, v]) => `<tr><td>${(k * 100).toFixed(2)}%</td><td>${p(v)}</td></tr>`).join("")}</table></div>`;
}

(async function init() {
  $("brand").innerHTML = wordmark(24);
  [model, metrics] = await Promise.all([fetch("model.json").then((r) => r.json()), fetch("metrics.json").then((r) => r.json())]);
  gallery(); evaluation(); fresh();
})();
