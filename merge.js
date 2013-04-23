var fs = require('fs');
var path = require('path');

var ENCODING = 'utf8';

function endsWith(str, suffix) {
	return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

function Watcher(args) {
	var me = this;
	var watchedDirectories = [];
	var version = 0;

	me.baseDirectory = args.directory;
	me.extensions = args.extensions;
	me.onChanged = args.onChanged;
	me.processContent = args.processContent;

	me.shouldIncludeFile = function(file) {
		for (var i = 0; i < me.extensions.length; i++) {
			if (endsWith(file, me.extensions[i])) {
				return true;
			}
		}
		return false;
	};

	me.watch = function(directory) {
		if (watchedDirectories.indexOf(directory) < 0) {
			watchedDirectories.push(directory);
			fs.watch(directory, function(event, filename) {
				rebuild();
			});
		}
	};

	me.onContentReady = function(content, contentVersion) {
		if (version == contentVersion) {
			me.onChanged(content);
		}
	};

	me.start = function() {
		rebuild();
	};

	function rebuild() {
		mergeFolder(me, ++version);
	}
}

function mergeFolder(watcher, version) {
	var remaining = 0;
	var content = '';

	function push() {
		remaining++;
	}

	function pop() {
		if (--remaining == 0) {
			watcher.onContentReady(content, version);
		}
	}

	function walk(directory) {
		watcher.watch(directory);
		push();
		fs.readdir(directory, function(err, list) {
			list.forEach(function(fileName) {
				var filePath = path.join(directory, fileName);
				push();
				fs.stat(filePath, function(err, stat) {
					if (stat && stat.isDirectory()) {
						walk(filePath);
					} else {
						if (watcher.shouldIncludeFile(filePath)) {
							push();
							fs.readFile(filePath, ENCODING, function(err, data) {
								var relativePath = filePath.substring(watcher.baseDirectory.length, filePath.length);
								content += (watcher.processContent 
									? watcher.processContent(relativePath, data)
									: data);
								pop();
							});
						}
					}
					pop();
				});
			});
			pop();
		});
	}

	walk(watcher.baseDirectory);
}

module.exports = {
	setup: function(args) {
		var watcher = new Watcher(args);
		watcher.start();
	}
};