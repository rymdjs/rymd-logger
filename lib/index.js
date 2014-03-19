(function(root) {

	'use strict';

	var slice = Array.prototype.slice;

	function Logger(module) {
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


	// Constants

	var Levels = {
		LEVEL_DEBUG: 1,
		LEVEL_GLOBAL: 10,
		LEVEL_ALL: 20
	};

	var Colors = {
		positive: "color: green",
		blue: "color: blue",
		purple: "color: purple",
		orange: "color: orange",
		gray: "color: gray",
		black: "color: black",
		red: "color: red"
	};

	var Styles = {
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

	Logger.prototype = {

		log: function(msg, styles) {
			var modulesToShow = intersect(Logger._modules, Logger._requestedModules);
			if( (modulesToShow.length && modulesToShow.indexOf(this.name) !== -1) ||
					Logger._requestedModules[0] === "all") {

				styles = decorate(slice.call(arguments, 1));
				return console.log("["+ this.name +"]\t%c " + msg, styles);
			}
		},

		separator: function() {
			var styles = decorate(Colors.red, Styles.bold);
			console.log("%c" + SEPARATOR, styles);
		},

		debug: function(msg) {
			if(Logger._level === Levels.LEVEL_DEBUG || 
				Logger._level === Levels.LEVEL_ALL) {

				this.log(msg);
			}
		},

		global: function(msg) {
			if(Logger._level === Levels.LEVEL_GLOBAL || 
				Logger._level === Levels.LEVEL_ALL) {

				this.log(msg, Colors.positive, Styles.bold);
			}
		}
	};

	Logger.Levels = Levels;
	Logger.Colors = Colors;
	Logger.Styles = Styles;

	// Defaults

	Logger._level = Levels.LEVEL_ALL;
	Logger._requestedModules = ['all'];

	module.exports = root.RymdLogger = Logger;

})(window);
