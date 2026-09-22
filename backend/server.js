import express from "express";

const app = express();
const PORT = 8080;

app.get("/", (req, res) => {
  res.json({
    message: "Infrastructure Project API",
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
