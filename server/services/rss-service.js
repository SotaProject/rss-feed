'use strict';

module.exports = ({ strapi }) => ({
	async getPosts(uid, limit, populate) {
		const posts = await strapi.db.query(uid).findMany({orderBy: { publishedAt: 'DESC' }, limit: limit, populate: {[`${populate}`]: true}});
		return posts;
	},
});
