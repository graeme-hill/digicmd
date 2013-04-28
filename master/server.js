var merge = require('./merge.js');
var path = require('path');
var express = require('express');

var app = express();

var mergedHtml = null;
var mergedCss = null;
var mergedJs = null;

function localPath(myPath) {
  return path.join(__dirname, myPath);
}

merge.setup({
  directory: localPath('/public/merged/html'), 
  extensions: ['.html'], 
  onChanged: function(content) {
    mergedHtml = content;
  },
  processContent: function(myPath, content) {
    var id = myPath.substring(1, myPath.length).split('.').slice(0, -1).join('.').replace(/\//g, '-');
    return '\n<script type="text/html" id="view-' + id + '">\n' + content + '\n</script>\n';
  }
});

merge.setup({
  directory: localPath('/public/merged/css'),
  extensions: ['.css'],
  onChanged: function(content) {
    mergedCss = content;
  },
  processContent: function(myPath, content) {
    return '\n# ' + myPath + '\n' + content + '\n';
  }
});

merge.setup({
  directory: localPath('/public/merged/js'),
  extensions: ['.js'],
  onChanged: function(content) {
    mergedJs = content;
  },
  processContent: function(myPath, content) {
    return '\n// ' + myPath + '\n(function() {\n' + content + '\n})();\n';
  }
});

var db = {
  "issues": [ { name: "one" }, { name: "two" } ],
  "issue_types": [],
  "users": []
};

app.configure(function() {
  app.use(express.bodyParser());
  app.use(express.static(localPath('/public')));
});

app.get("/static/merged.html", function(req, res) {
  res.contentType('text/html');
  res.send(mergedHtml);
});

app.get("/static/merged.css", function(req, res) {
  res.contentType('text/css');
  res.send(mergedCss);
});

app.get("/static/merged.js", function(req, res) {
  res.contentType('application/javascript');
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
