// Browser and Node scoring. Mirrors featurize() in ml/simulate.py.
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.SaathiScore = factory();
})(typeof self !== "undefined" ? self : this, function () {
  function featurize(c) {
    const prior = c.prior_n;
    return {
      log_amount_ratio: Math.log((c.amount + 1) / (c.median + 1)),
      new_payee: prior === 0 ? 1 : 0,
      log_prior_payments: Math.log1p(prior),
      step_up: prior && c.last_amt > 0 ? Math.log(c.amount / c.last_amt) : 0,
      consecutive_increases: Math.min(c.consec, 5),
      log_cumulative_ratio: Math.log((c.cum14 + c.amount + 1) / (c.median + 1)),
      young_payee: c.age <= 30 ? 1 : 0,
      unknown_call: c.call ? 1 : 0,
      payee_reports: Math.min(c.reports, 2),
      night: c.hour >= 22 || c.hour < 6 ? 1 : 0,
      balance_fraction: Math.min(1, c.amount / Math.max(c.balance, 1)),
    };
  }

  function score(model, c) {
    const x = featurize(c);
    let logit = model.intercept;
    model.features.forEach((name, i) => {
      logit += model.coef[i] * ((x[name] - model.mean[i]) / model.scale[i]);
    });
    const probability = 1 / (1 + Math.exp(-logit));
    return { probability, flagged: probability >= model.threshold, reasons: reasons(c) };
  }

  function reasons(c) {
    const out = [];
    if (c.reports >= 1) out.push("reported_payee");
    if (c.consec >= 2) out.push("escalating");
    if (c.call) out.push("unknown_call");
    if (c.prior_n === 0) out.push("new_payee");
    if (c.amount >= 3 * c.median) out.push("high_amount");
    return out;
  }

  const COPY = {
    reported_payee: ["Other people have reported this payee.", "दूसरे लोगों ने इस पाने वाले की शिकायत की है।"],
    escalating: ["Your payments to this payee keep getting bigger.", "इस व्यक्ति को आपके पेमेंट लगातार बढ़ रहे हैं।"],
    unknown_call: ["You were just on a call with an unknown number.", "आप अभी किसी अनजान नंबर से बात कर रहे थे।"],
    new_payee: ["You have not paid this person before.", "आपने इन्हें पहले कभी पैसे नहीं भेजे हैं।"],
    high_amount: ["This is much more than you usually send.", "यह आपकी आम रकम से काफी ज़्यादा है।"],
  };

  function templateCopy(c, relation) {
    const list = reasons(c).slice(0, 3);
    const amount = "₹" + Number(c.amount).toLocaleString("en-IN");
    return {
      source: "template",
      senior_en: "Please pause for a moment. " + list.map((r) => COPY[r][0]).join(" ") + " Scammers often create this pattern. You are still in control.",
      senior_hi: "कृपया एक पल रुकिए। " + list.map((r) => COPY[r][1]).join(" ") + " ठगी में अक्सर ऐसा होता है। फ़ैसला आपका ही है।",
      contact_en: `${relation} is about to send ${amount} and this payment looks unusual. A quick call could help.`,
      contact_hi: `${relation} ${amount} भेजने वाली/वाले हैं और यह पेमेंट असामान्य लग रहा है। एक कॉल कर लीजिए।`,
    };
  }

  return { featurize, score, reasons, templateCopy };
});
