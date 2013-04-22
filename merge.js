var fs = require('fs');
var path = require('path');

var ENCODING = 'utf8';

function endsWith(str, suffix) {
	return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

function watchFolder(baseDirectory, extensions, onChanged) {
	var me = this;
	var watchedDirectories = [];
	var version = 0;

	me.baseDirectory = baseDirectory;

	me.shouldIncludeFile = function(file) {
		for (var i = 0; i < extensions.length; i++) {
			if (endsWith(file, extensions[i])) {
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
			onChanged(content);
		}
	};

	function rebuild() {
		mergeFolder(me, ++version);
	}

	rebuild();
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
								content += '\n' + data + '\n';
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
		watchFolder(args.directory, args.extensions, args.onChanged);
	}
};