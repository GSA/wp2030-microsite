const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const { EleventyHtmlBasePlugin } = require("@11ty/eleventy");
const markdownItAnchor = require("markdown-it-anchor");
const markdownItAttrs = require("markdown-it-attrs");
const yaml = require("js-yaml");
const path = require("path");
const { DateTime } = require("luxon");
const elasticlunr = require("elasticlunr");
const { stripHtml } = require("string-strip-html");

module.exports = function(eleventyConfig) {
  const pathPrefix = path.join(process.env.BASEURL || "/", "workplace");

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
  eleventyConfig.addShortcode("feature", featureShortcode);
  eleventyConfig.addPairedShortcode("iconList", iconListShortcode);
  eleventyConfig.addShortcode("iconListItem", iconListItemShortcode);
  eleventyConfig.addShortcode("banner", bannerShortcode);
  eleventyConfig.addPairedShortcode("miniGallery", miniGalleryShortcode);
  eleventyConfig.addPairedShortcode("miniGalleryItem", miniGalleryItemShortcode);

  // Custom filters
  eleventyConfig.addFilter("postDate", dateObj => DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_FULL));
  eleventyConfig.addFilter("search", searchFilter);

  return {
    pathPrefix,
    dir: {
      output: path.join("_site", "workplace")
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};

function featureShortcode(headingText, actionText, actionUrl, imageUrl) {
  return `<section class="usa-hero padding-y-8" style="background-image: url(${imageUrl})">
            <div class="grid-container">
              <h1 class="usa-hero__heading">
                <span class="usa-hero__heading--alt">${headingText}</span>
              </h1>
              <a class="usa-button" href="${actionUrl}">${actionText}</a>
            </div>
          </section>`;
}

function iconListShortcode(content) {
  return `<ul class="usa-icon-list">${content}</ul>`;
}

function iconListItemShortcode(classes, icon, text) {
  return `<li class="usa-icon-list__item">
            <div class="usa-icon-list__icon ${classes}">
              <svg class="usa-icon" aria-hidden="true" role="img">
                <use xlink:href="assets/uswds/img/sprite.svg#${icon}"></use>
              </svg>
            </div>
            <div class="usa-icon-list__content">
              ${text}
            </div>
          </li>`;
}

function bannerShortcode(imageUrl, imageAlt) {
  return `<img src="${imageUrl}" alt="${imageAlt}" class="width-full maxh-card-lg" style="object-fit: cover;">`;
}

function miniGalleryShortcode(content) {
  return `<div class="grid-row grid-gap">${content}</div>`;
}

function miniGalleryItemShortcode(content, imageUrl, imageAlt) {
  return `<div class="tablet:grid-col-4 overflow-hidden">
            <img src="${imageUrl}" alt="${imageAlt}" class="height-full width-full maxh-card" style="object-fit: cover;">
            <div>${content}</div>
          </div>`;
}

const striptags = require("striptags");

function searchFilter(collection) {
  const searchIndex = elasticlunr(function () {
    this.setRef("id");
    this.addField("title");
    this.addField("content");
    this.addField("excerpt");
  });

  collection.forEach(page => {
    console.log(page.content)

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
}
