(function(root) {

	'use strict';

	var slice = Array.prototype.slice;

	function Logger(module, options) {
		var defaults = {
			showModule: true,
			showTimestamps: true
		};

		this.options = extend({}, defaults, options);

		this.name = module;
		Logger._modules.push(this.name);
	}

	Logger._modules = [];
	Logger._requestedModules = [];
	Logger._level = [];

	/**
		Filter modules to log.

		Logger.view('Module1', 'Module2');
	*/
	Logger.view = function() {
		Logger._requestedModules = [];

		var modules = slice.call(arguments);
		modules.forEach(function(module) {
			if(Logger._requestedModules.indexOf(module) === -1) {
				Logger._requestedModules.push(module);
			}
		});
	};

	Logger.filter = function(level) {
		Logger._level = level;
	};

	// Constants

	var Levels = Logger.Levels = {
		LEVEL_DEBUG: 10,
		LEVEL_GLOBAL: 20,
		LEVEL_ALL: 1
	};

	var Colors = Logger.Colors = {
		positive: "color: green",
		blue: "color: blue",
		purple: "color: purple",
		orange: "color: orange",
		gray: "color: gray",
		black: "color: black",
		red: "color: red"
	};

	var Styles = Logger.Styles = {
		bold: "font-weight: bold",
		italic: "font-style: italic"
	};

	var SEPARATOR = new Array(130).join("-");

	function decorate(styles) {
		if(styles.join) {
				return styles.join(";");
		}
		return slice.call(arguments).join(";");
	}

	function intersect(a, b) {
    var t;
		// indexOf to loop over shorter
    if (b.length > a.length) t = b, b = a, a = t;

    return a.filter(function (e) {
        if (b.indexOf(e) !== -1) return true;
    })
		// extra step to remove duplicates
		.filter(function (e, i, c) {
        return c.indexOf(e) === i;
    });
	}

	function extend(obj) {
		slice.call(arguments, 1).forEach(function(source) {
			if (source) {
				for (var prop in source) {
					obj[prop] = source[prop];
				}
			}
		});

		return obj;
	}

	function t(string, data){
		for(var p in data) {
				string = string.replace(new RegExp('{{'+p+'}}','g'), data[p]);
		}

		return string;
	}

	function formatDate(date) {
		return t("{{minutes}}:{{seconds}}:{{milli}}", {
			minutes: date.getMinutes(),
			seconds: date.getSeconds(),
			milli: date.getMilliseconds()
		});
	}

	Logger.prototype = {

		log: function(msg, styles) {
			var modulesToShow = intersect(Logger._modules, Logger._requestedModules);
			if( (modulesToShow.length && modulesToShow.indexOf(this.name) !== -1) ||
					Logger._requestedModules.length === 0) {

				styles = decorate(slice.call(arguments, 1));
				var format = "[";

				if(this.options.showModule) {
					format += "{{module}}";
				}
				if(this.options.showTimestamps) {
					format += " {{time}}";
				}

				format += "]\t%c {{message}}";

				var output = t(format, {
					message: msg,
					time: formatDate(new Date()),
					module: this.name
				});

				return console.log(output, styles);
			}
		},

		separator: function() {
			var styles = decorate(Colors.red, Styles.bold);
			console.log("%c" + SEPARATOR, styles);
		},

		debug: function(msg) {
			if(Logger._level > Levels.LEVEL_DEBUG) return;
			this.log(msg);
		},

		global: function(msg) {
			this.log(msg, Colors.positive, Styles.bold);
		}
	};

	// Defaults

	Logger._level = Levels.LEVEL_ALL;

	module.exports = root.RymdLogger = Logger;

})(window);
