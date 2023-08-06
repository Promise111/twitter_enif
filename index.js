require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 8000;
const T = require("./twitter");

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("Up and running!");
});

// user lookup
// app.get("/", (req, res, next) => {
//   try {
//     const resp = T.
//   } catch (error) {
//     next(error);
//   }
// });

app.get("/webhook/twitter", (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

app.post("/webhook/twitter", (req, res, next) => {
  const event = req.body;
  try {
    if (event.tweet_create_events) {
      // Handle mentions or direct messages
      event.tweet_create_events.forEach((tweetEvent) => {
        if (tweetEvent.message_create) {
          // Handle direct message
          const messageText = tweetEvent.message_create.message_data.text;
          console.log("Received direct message:", messageText);
        } else if (tweetEvent.in_reply_to_status_id) {
          // Handle mention
          const mentionText = tweetEvent.text;
          console.log("Received mention:", mentionText);
        }
      });
    }
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
});

T.post(
  `account_activity/all/${process.env.envName}/webhooks`,
  { url: process.env.twitter_webhook_url },
  (err, data, response) => {
    console.log(response);
    if (err) {
      console.error("Error setting up webhook", err);
    } else {
      console.log(data);
      console.log("Webhook running successfully");
    }
  }
);

app.use(function (error, req, res, next) {
  res
    .status(error?.status || error?.statusCode)
    .json({ status: "error", message: "error occurred", data: error });
});

app.listen(PORT, () => {
  console.log(`[server]: Listening on http://localhost:${PORT}`);
});
