// const { CosmosClient } = require("@azure/cosmos");
const express = require("express");
const dotenv = require("dotenv");
const axios = require("axios")


const app = express();
dotenv.config();
const PORT = 8080

app.use(express.json());
// const client = new CosmosClient(process.env.COSMOS_CONNECTION_STRING);
// const database = client.database("nexahub");
// const container = database.container("hub");

app.post("/api/submit", async (req, res) => {
  let { name, email, type, message } = req.body;
  if (!name || !email || !type || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }
  const complaint = { name, email, type, message, date: new Date() };
  try {
    // await container.items.create(complaint);
    const sent = await axios.post(process.env.AZURE_FUNCTION, complaint);
    // console.log(sent)
    res.status(200).json({ message: "Complaint submitted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to submit complaint" });
  }
});

app.listen(PORT, () => {
  console.log(`Running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
