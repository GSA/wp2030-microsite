const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const embedEverythingPlugin = require("eleventy-plugin-embed-everything");
const markdownItAnchor = require("markdown-it-anchor");
const markdownItAttrs = require("markdown-it-attrs");
const yaml = require("js-yaml");
const customShortcodes = require("./modules/shortcodes");
const customFilters = require("./modules/filters");
const markdownIt = require("./modules/markdown");

module.exports = function(eleventyConfig) {
  const pathPrefix = process.env.BASEURL || "/";

  // Copy assets directory
  eleventyConfig.addPassthroughCopy("assets");

  // Add 11ty plugins
  eleventyConfig.addPlugin(eleventyNavigationPlugin);
  eleventyConfig.addPlugin(embedEverythingPlugin);

  // Add markdown-it plugins
  eleventyConfig.setLibrary("md", markdownIt);
  eleventyConfig.amendLibrary("md", md => md.use(markdownItAnchor));
  eleventyConfig.amendLibrary("md", md => md.use(markdownItAttrs));
  eleventyConfig.amendLibrary("md", md => {md.options.typographer = true;});

  // Read YAML files in the _data directory
  eleventyConfig.addDataExtension("yml", contents => yaml.load(contents));
  eleventyConfig.addDataExtension("yaml", contents => yaml.load(contents));

  // Watch for changes in additional directories
  eleventyConfig.addWatchTarget("_data");

  // Make these variables available everywhere on the site
  eleventyConfig.addGlobalData("pathPrefix", pathPrefix);

  // Custom shortcodes
  eleventyConfig.addPlugin(customShortcodes);

  // Custom filters
  eleventyConfig.addPlugin(customFilters);

  // Convenience Shortcode to add usa-link--external class
  // based on domain
  // to use {% externalLinkClass someURL %}
  eleventyConfig.addShortcode("externalLinkClass", url => {
    let domain = new URL(url).hostname.toLowerCase();
    if (! domain.endsWith('gsa.gov')) {
      return "usa-link--external"
    }
  })

  return {
    pathPrefix,
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};
