const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const { EleventyHtmlBasePlugin } = require("@11ty/eleventy");
const markdownItAnchor = require("markdown-it-anchor");
const markdownItAttrs = require("markdown-it-attrs");
const yaml = require("js-yaml");
const customShortcodes = require("./modules/shortcodes");
const customFilters = require("./modules/filters");

module.exports = function(eleventyConfig) {
  console.log("using BASEURL:", process.env.BASEURL);
  const pathPrefix = process.env.BASEURL || "/";
  console.log("using pathPrefix:", pathPrefix);

  // Copy assets directory
  eleventyConfig.addPassthroughCopy("assets");

  // Add 11ty plugins
  eleventyConfig.addPlugin(eleventyNavigationPlugin);
  eleventyConfig.addPlugin(EleventyHtmlBasePlugin);

  // Add markdown-it plugins
  eleventyConfig.amendLibrary("md", md => md.use(markdownItAnchor));
  eleventyConfig.amendLibrary("md", md => md.use(markdownItAttrs));

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

  return {
    pathPrefix,
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};
