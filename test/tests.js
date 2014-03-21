var should = chai.should(),
		Logger = window.RymdLogger

describe("Logger", function() {

	var logger = new Logger("TestModule")
			logger2 = new Logger("TestModule2")

	it("should have different verbosity levels", function() {
		Logger.Levels.LEVEL_GLOBAL.should.exist
		Logger.Levels.LEVEL_DEBUG.should.exist
		Logger.Levels.LEVEL_ALL.should.exist
	})

	it("should log global level", function() {
		logger.global("Test")
		logger.debug("Test")

		logger.separator();

		logger2.debug("Test 2")

		logger.separator();

		Logger.view("TestModule2")

		logger.debug("Test")
		logger2.debug("Test 2")

		logger.separator()

		Logger.view()
		Logger.filter(Logger.Levels.LEVEL_GLOBAL)
		logger.debug("This should not be seen")
		logger.global("This should be seen")
	})
})
