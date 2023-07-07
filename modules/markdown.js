const markdownIt = require("markdown-it");

module.exports = markdownIt({
  html: true,
  breaks: false,
  linkify: true
});
