var express = require("express");
var app = express();

var db = {
  "issues": [],
  "issue_types": [],
  "users": []
};

app.configure(function() {
  app.use(express.bodyParser());
  app.use(express.static(__dirname + '/public'));
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
