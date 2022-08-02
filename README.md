# RSS Fedd for Strapi

This plugin will help you create RSS feed from your data in strapi, for this you need to configure the plugin in config/plugins.js

```
module.exports = {
  // ...
  'rss-feed': {
    enabled: true,
    config: {
      title: 'Your site name',
      description: 'Best site in the world',
      link: 'https://example.com',
      contentTypes: {
        publication: {
          title: 'Title',
          description: 'Description',
          link: 'https://example.com/post/${id}'
        }
      },
    },
    resolve: './src/plugins/rss-feed',
  },
  // ...
}

```# rss-feed
