'use strict';

module.exports = [
	{
		method: 'GET',
        path: '/:modelName',
        handler: 'rssController.rss_feed',
	},
];