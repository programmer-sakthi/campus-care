import express from "express";

const app = express();


app.listen(8000, () => {
  console.log("Booking Service is running on port 8000");
});

app.get("/", (req, res) => {
  res.send("Booking Service is running!");
});