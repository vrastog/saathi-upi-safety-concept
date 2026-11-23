// Local development server. Run: GEMINI_API_KEY=... node scripts/dev-server.js
const http = require("http"), fs = require("fs"), path = require("path");
const explain = require("../api/explain");
const root = path.join(__dirname, "..", "web", "public");
const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".json": "application/json" };

http.createServer((req, res) => {
  const url = new URL(req.url, "http://localhost");
  if (url.pathname === "/api/explain") {
    let raw = "";
    req.on("data", (d) => { raw += d; if (raw.length > 2000) req.destroy(); });
    req.on("end", () => {
      try { req.body = JSON.parse(raw || "{}"); } catch { req.body = {}; }
      res.status = (code) => { res.statusCode = code; return res; };
      res.json = (body) => { res.setHeader("content-type", "application/json"); res.end(JSON.stringify(body)); };
      explain(req, res);
    });
    return;
  }
  const file = path.normalize(path.join(root, url.pathname === "/" ? "index.html" : url.pathname));
  if (!file.startsWith(root + path.sep) || !fs.existsSync(file)) { res.statusCode = 404; return res.end("Not found"); }
  res.setHeader("content-type", types[path.extname(file)] || "text/plain");
  fs.createReadStream(file).pipe(res);
}).listen(process.env.PORT || 3000, () => console.log("Saathi running on http://localhost:" + (process.env.PORT || 3000)));
