"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const githubApi = require("./githubApiAdaptor");
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

const TOKEN = "79oeh0RzKNzyKSLP8yDPu0wB";

function parseGithubUser(response, extra = []) {
  let text = `User *${response.login}* found!`;

  const userProps = ["name", "html_url", ...extra];
  for (let i = 0, l = userProps.length; i < l; i++) {
    let key = userProps[i];
    if (response[key]) {
      text += `\n${key}: ${response[key]}`;
    }
  }

  return text;
}

// Just an example request to get you started..
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.post("/", (req, res) => {
  const { token, text, response_url } = req.body;
  console.log("use me to send delayed response:", response_url);

  if (token !== TOKEN) {
    const body = {
      response_type: "ephemeral",
      text: "Invalid token."
    };
    res.status(400).send(body);
    return;
  }
  if (!text || !text.length) {
    const body = {
      response_type: "ephemeral",
      text: "Bad Request"
    };
    res.status(400).json(body);
    return;
  }

  const args = text.split(" ");
  const username = args[0];

  githubApi
    .getUser(username)
    .then(response => {
      const text =
        args.length > 1
          ? parseGithubUser(response, args.slice(1))
          : parseGithubUser(response);

      const body = {
        response_type: "ephemeral",
        text
      };
      res.status(200).json(body);
      return;
    })
    .catch(err => {
      const body = {
        response_type: "ephemeral",
        text: "Not Found"
      };
      res.status(404).json(body);
      return;
    });
});

// This code "exports" a function 'listen` that can be used to start
// our server on the specified port.
exports.listen = function(port, callback) {
  callback =
    typeof callback != "undefined"
      ? callback
      : () => {
          console.log("Listening on " + port + "...");
        };
  app.listen(port, callback);
};
