const { CosmosClient } = require("@azure/cosmos");

const client = new CosmosClient(process.env.COSMOS_CONNECTION_STRING);
const database = client.database("nexahub");
const container = database.container("hub");

app.post("/api/submit", async (req, res) => {
  const { name, email, type, message } = req.body;

  // Validate input
  if (!name || !email || !type || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Store the complaint in the database
  const complaint = { name, email, type, message, date: new Date() };
  try {
    await container.items.create(complaint);

    // Trigger email notification
    await axios.post("https://nexahub.azurewebsites.net/api/nexaHubEmail?code=UiX31xGJWcMOkqcnUxjgB8_8vFZBaeNlbphnPSpRxOIeAzFubQ5J6Q%3D%3D", complaint);
    res.status(200).json({ message: "Complaint submitted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to submit complaint" });
  }
});
