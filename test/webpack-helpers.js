import path from 'path'
import webpack from 'webpack'

import SentryWebpackPlugin from '../src/index'

export const OUTPUT_PATH = path.resolve(__dirname, '../.tmp')

import {
	SENTRY_API_KEY,
	SENTRY_ORGANISATION,
	SENTRY_PROJECT
} from './sentry-helpers'

export function createWebpackConfig(sentryConfig, webpackConfig) {
	return Object.assign({}, {
		devtool: 'source-map',
		entry: {
			index: path.resolve(__dirname, 'fixtures/index.js')
		},
		output: {
			path: OUTPUT_PATH,
			filename: '[name].bundle.js'
		},
		plugins: [
			configureSentryPlugin(sentryConfig)
		]
	}, webpackConfig)
}

function configureSentryPlugin(config) {
	const options = Object.assign({}, config, {
		organisation: SENTRY_ORGANISATION,
		project: SENTRY_PROJECT,
		apiKey: SENTRY_API_KEY
	})

	return new SentryWebpackPlugin(options)
}

export function runWebpack(config) {
	return new Promise((resolve, reject) => {
		webpack(config, (err, stats) => {
			if (stats.toJson().errors.length)
				reject({ errors: stats.toJson().errors })
			else
				resolve({ config, stats })
		})
	})
}