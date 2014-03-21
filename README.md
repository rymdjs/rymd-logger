# Rymd Logger

A simple logger module that filters on log levels and calling modules.

## Usage

```javascript
// Class
var Logger = require('rymd-logger'),
	/*
		@param Logger name|Source module
	*/
	logger = new Logger('myModule')

// Regular debug text with source module and timestamp (MM:ss:mm)
logger.debug('This is logged')
// => [myModule 22:42:134]	 This is logged

// Global program flow logging
logger.global('This is overall program flow')
// => [myModule 22:42:128]	 This is overall program flow
```

## Filtering

One can filter on three debug levels: all output, debug output or global output.

They can be accessed by:

```javascript
Logger.Levels.LEVEL_ALL
Logger.Levels.LEVEL_GLOBAL
Logger.Levels.LEVEL_DEBUG
```

And used as (show only global messages):

```javascript
Logger.filter(Logger.Levels.LEVEL_GLOBAL)
logger.debug("This should not be seen")
logger.global("This should be seen")
```

It's also possible to view only messages from certain modules:

```javascript
var firstLogger = new Logger("TestModule"),
		secondLogger = new Logger("TestModule2")

/*
	Logger.view("Module", "Module2"...)

	@param String... Module names
*/
Logger.view("TestModule2")

firstLogger.debug("This won't be seen")
secondLogger.debug("This will be seen")
```

Call `logger.view()` with empty arguments to reset.

## Build tasks

	# Default: builds bundle.js from lib/index.js
	gulp
	gulp build

	# Watches lib/main.js for changes and generates a build
	gulp watch

	# Run JSHint
	gulp lint

	# Removes `build`
	gulp clean

## Develop

	npm install
	gulp watch

A concatenated `bundle.js` will be generated in the `build` directory.

## Tests

Tests reside in the `test/tests.js` file, and uses Mocha and Chai.js.

	gulp test

Tests run in a browser window for now, since headless browsers like
PhantomJS don't support cutting edge HTML5 APIs like `IndexedDB` (as of
PhantomJS 1.9.x).
