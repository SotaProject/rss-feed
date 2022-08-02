'use strict';

const rssRoutes = require('./rss-routes');

module.exports = {
	'content-api': {
		type: 'content-api',
		routes: rssRoutes,
	},
};