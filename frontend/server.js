import express from "express";

const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
  res.send(
    `
        <h1>Infrastructure Project</h1>
        <p>Frontend is on port ${PORT} and deployed by CI/CD</p>
        `,
  );
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
  });
});

app.listen(PORT, () => {
  console.log(`frontend is working on http://localhost:${PORT}`);
});
