import express from "express";

const app = express();


app.listen(process.env.PORT, () => {
  console.log(`Backend is running on port ${process.env.PORT}`);
});
  
app.get("/", (req, res) => {
  res.send("Booking Service is running!");
});