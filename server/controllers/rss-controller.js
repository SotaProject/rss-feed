'use strict';

const { getPluginService } = require('../utils/getPluginService');

module.exports = {
  async rss_feed(ctx) {
    const models  = getPluginService(strapi, 'settingsService').get();
    const { params } = ctx.request;
    let { modelName } = params;
    modelName = modelName.replace(".xml", "");

    if (!modelName) {
      const err = 'A model name path variable is required.';
      ctx.body = err;
      // throw Error(err);
      return
    }
    if (!(modelName in models.contentTypes)) {
      const err = `${modelName} model name not found, all models must be defined in the settings and are case sensitive.`;
      ctx.body = err;
      // throw Error(err);
      return
    }


    let rssItemsXml = '';
    let posts = [];
    if(typeof(models.contentTypes[modelName].category) == 'object') {
      posts = await getPluginService(strapi, 'rssService').getPosts(`api::${modelName}.${modelName}`, 100, models.contentTypes[modelName].category.relation_field);
    } else {
      posts = await getPluginService(strapi, 'rssService').getPosts(`api::${modelName}.${modelName}`, 100);
    }
    for (let i = 0; i < posts.length; i++) {
      if(!posts[i].publishedAt) continue;
      let title = "";
      let author = "";
      let description = "";
      let content = "";
      let link = models.contentTypes[modelName].link;
      let category = {};
      for (let key in posts[i]) {
        if (key == models.contentTypes[modelName].title) title = posts[i][key];
        if (key == models.contentTypes[modelName].author) author = posts[i][key];
        if (key == models.contentTypes[modelName].description) description = posts[i][key];
        if (key == models.contentTypes[modelName].content) content = posts[i][key];
        if (key == models.contentTypes[modelName].category.relation_field) category = posts[i][key];

        link = link.replace('${'+key+'}', posts[i][key]);
      }
      if (!author && models.contentTypes[modelName].default_author) author = models.contentTypes[modelName].default_author;
      if (!category) {
        category = {[models.contentTypes[modelName].category.name]: ''};
        link = link.replace('${category_link}', '_');
      } else {
        console.log(category[models.contentTypes[modelName].category.link]);
        link = link.replace('${category_link}', category[models.contentTypes[modelName].category.link]);
      }
      content = '<p>' + description + '</p>\n' + content
      rssItemsXml += `
      <item>
        <title><![CDATA[${title}]]></title>
        <author><![CDATA[${author}]]></author>
        <link>${link}</link>
        <pubDate>${posts[i].publishedAt}</pubDate>
        <guid isPermaLink="false">${posts[i].id}</guid>
        <description><![CDATA[${description}]]></description>
        <category>${category[models.contentTypes[modelName].category.name]}</category>
        <content:encoded>
            <![CDATA[${content}]]>
        </content:encoded>
      </item>`;
    }
    ctx.body = `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">
      <channel>
          <title><![CDATA[${models.title}]]></title>
          <link>${models.link}</link>
          <description>
            <![CDATA[${models.description}]]>
          </description>
          ${rssItemsXml}
      </channel>
    </rss>`;
    ctx.set("content-type", "text/xml; charset=utf-8");
  }
};
