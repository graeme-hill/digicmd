var merge = require("./merge.js");
var express = require("express");
var app = express();

var mergedHtml = null;
var mergedCss = null;
var mergedJs = null;

function localPath(path) {
  return path.join(__dirname, path);
}

merge.setup({
  directory: localPath('/public/merged/html'), 
  extensions: ['.html'], 
  onChanged: function(content) {
    mergedHtml = content;
  }
});

merge.setup({
  directory: localPath('/public/merged/html'),
  extensions: ['.css'],
  onChanged: function(content) {
    mergedCss = content;
  }
});

merge.setup({
  directory: localPath('/public/merged/js'),
  extensions: ['.js'],
  onChanged: function(content) {
    mergedJs = content;
  }
});

var db = {
  "issues": [ { name: "one" }, { name: "two" } ],
  "issue_types": [],
  "users": []
};

app.configure(function() {
  app.use(express.bodyParser());
  app.use(localPath('/public'));
});

app.get("/static/merged.html", function(req, res) {
  res.send(mergedHtml);
});

app.get("/static/merged.css", function(req, res) {
  res.send(mergedCss);
});

app.get("/static/merged.js", function(req, res) {
  res.send(mergedJs);
});

app.get("/api/v1/issues", function(req, res) {
  res.json(db.issues);
});

app.post("/api/v1/issues", function(req, res) {
  var issue = req.body;
  db.issues.push(issue);
  res.json(issue);
});

app.listen(1111);
