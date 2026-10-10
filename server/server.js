require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // allow the React frontend (Vite dev server) to call this API
app.use(express.json());

// API keys live in .env which is in .gitignore
const ELASTIC_EMAIL_API_URL =
  "https://api.elasticemail.com/v4/emails/transactional";

const subscribers = [];

function isValidEmail(email) {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// POST /subscribe - add a subscriber and send them a welcome email
app.post("/subscribe", async (req, res) => {
  const { email } = req.body;

  if (!isValidEmail(email)) {
    return res.status(400).json({ message: "Please provide a valid email address." });
  }

  if (subscribers.includes(email)) {
    return res.status(200).json({ message: "You're already subscribed!" });
  }

  subscribers.push(email);

  try {
    const response = await fetch(ELASTIC_EMAIL_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-ElasticEmail-ApiKey": process.env.ELASTICEMAIL_API_KEY,
      },
      body: JSON.stringify({
        Recipients: { To: [email] },
        Content: {
          From: process.env.ELASTICEMAIL_FROM_EMAIL,
          Subject: "Welcome to DEV@Deakin!",
          Body: [
            {
              ContentType: "HTML",
              Content:
                "<strong>Thanks for subscribing to the DEV@Deakin Daily Insider newsletter!</strong>",
            },
          ],
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Elastic Email error:", data);
      return res.status(500).json({ message: "Subscribed, but the welcome email failed to send." });
    }

    console.log(`Email sent to ${email} - Status: ${response.status}, MessageID: ${data.MessageID}`);

    return res.status(response.status).json({
      message: "Subscribed! A welcome email is on its way.",
      messageId: data.MessageID,
    });
  } catch (error) {
    console.error("Elastic Email request failed:", error.message);
    return res.status(500).json({ message: "Subscribed, but the welcome email failed to send." });
  }
});

// GET /subscribers - simple helper route to verify the mailing list while testing
app.get("/subscribers", (req, res) => {
  res.status(200).json({ count: subscribers.length, subscribers });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
