const { DateTime } = require("luxon");
const elasticlunr = require("elasticlunr");
const striptags = require("striptags");

module.exports = (eleventyConfig) => {
  eleventyConfig.addFilter("postDate", dateObj => DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_FULL));

  eleventyConfig.addFilter("search", (collection) => {
    const searchIndex = elasticlunr(function () {
      this.setRef("id");
      this.addField("title");
      this.addField("content");
      this.addField("excerpt");
    });

    collection.forEach(page => {
      const content = striptags(page.content)
        .replace(/^\s+|\s+$|\s+(?=\s)|/g, "")
        .replace(/\n|\t|\r/g, " ");
      const excerpt = content.substring(0, 200).concat("...");

      searchIndex.addDoc({
        id: page.url,
        title: page.data.title,
        content,
        excerpt
      });
    });

    return searchIndex.toJSON();
  });
}
