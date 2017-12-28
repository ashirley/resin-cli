###
Copyright 2016-2017 Resin.io

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
###

chalk = require('chalk')
errors = require('resin-cli-errors')
patterns = require('./utils/patterns')
Promise = require('bluebird')
analytics = require('analytics.node').core
Raven = require('analytics.node').sentryIntegration
dsn = require('./config').sentryDsn
release = require('../package.json').version
ravenOptions =
	config: dsn
	release: release
	captureUnhandledRejections: true
	disableConsoleAlerts: true
analytics.addIntegration(Raven)
analytics.initialize 'Sentry': ravenOptions
analytics.setContext analytics.anonymize(extra:
	args: process.argv
	node_version: process.version)

exports.handle = (error) ->
	message = errors.interpret(error)
	return if not message?

	if process.env.DEBUG
		message = error.stack

	patterns.printErrorMessage(message)

	Promise.fromCallback((cb) ->
		console.log('inside promise')
		analytics.captureException(error)
	)
	.timeout(1000)
	.catch(-> # Ignore any errors (from error logging, or timeouts)
	).finally ->
		process.exit(error.exitCode or 1)
