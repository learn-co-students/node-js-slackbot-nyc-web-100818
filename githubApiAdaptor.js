require("dotenv").config();
const rp = require("request-promise");

class GithubApiAdaptor {
  constructor() {
    this.baseUrl = "https://api.github.com";
    this.defaultHeaders = {
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
      "User-Agent": "ian-test slackbot",
      Authorization: `Bearer ${process.env.GITHUB_API_KEY}`
    };
  }

  getUser(username) {
    return rp({
      method: "GET",
      uri: `${this.baseUrl}/users/${username}`,
      headers: this.defaultHeaders,
      json: true
    });
  }
}

module.exports = new GithubApiAdaptor();
