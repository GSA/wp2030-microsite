const md = require("./markdown");
const dedent = require("dedent");

module.exports = (eleventyConfig) => {
  eleventyConfig.addShortcode("feature", (headingText, actionText, actionUrl, imageUrl) => {
    const filteredImageUrl = eleventyConfig.getFilter("url")(imageUrl);
    const filteredActionUrl = eleventyConfig.getFilter("url")(actionUrl);
    return `<section class="usa-hero padding-y-8" style="background-image: url(${filteredImageUrl})">
              <div class="grid-container">
                <h1 class="usa-hero__heading grid-col-8">
                  <span class="usa-hero__heading--alt">${headingText}</span>
                </h1>
                <a class="usa-button" href="${filteredActionUrl}">${actionText}</a>
              </div>
            </section>`;
  });

  eleventyConfig.addPairedShortcode("iconList", (content) => {
    return `<ul class="usa-icon-list">${content}</ul>`;
  });

  eleventyConfig.addShortcode("iconListItem", (classes, icon, text) => {
    const iconUrl = eleventyConfig.getFilter("url")(`/assets/uswds/img/sprite.svg#${icon}`);
    return `<li class="usa-icon-list__item">
              <div class="usa-icon-list__icon ${classes}">
                <svg class="usa-icon" aria-hidden="true" role="img">
                  <use xlink:href="${iconUrl}"></use>
                </svg>
              </div>
              <div class="usa-icon-list__content">
                ${text}
              </div>
            </li>`;
  });

  eleventyConfig.addShortcode("banner", (imageUrl, imageAlt) => {
    const filteredImageUrl = eleventyConfig.getFilter("url")(imageUrl);
    return `<img src="${filteredImageUrl}" alt="${imageAlt}" class="width-full maxh-card-lg" style="object-fit: cover;">`;
  });

  eleventyConfig.addPairedShortcode("gallery", function (content, args) {
    const { name, maxVisible = -1, link = true, lightbox = true } = args || {};
    if (name && this.ctx.galleries && this.ctx.galleries[name]) {
      const gallery = this.ctx.galleries[name];
      const galleryItem = eleventyConfig.javascriptFunctions.galleryItem;
      gallery.forEach((photo, index) => {
        content += galleryItem(photo.title, {
          src: photo.src || "",
          alt: photo.alt || "",
          link,
          lightbox,
          hidden: (maxVisible >= 0) && (index > maxVisible - 1)
        });
      });
    }
    return `<div class="grid-row grid-gap">${content}</div>`;
  });

  eleventyConfig.addPairedShortcode("galleryItem", (content, args) => {
    const { src, alt, link, lightbox, hidden } = args || {};
    const filteredImageUrl = eleventyConfig.getFilter("url")(src);
    const lightboxData = lightbox ? `
      data-fslightbox
      data-alt="${alt}"
    ` : "";
    let html = `<div class="grid-col-4 ${hidden ? 'display-none' : 'margin-y-2'}">`;
    html += `<div>`;
    html += link ? `<a href="${filteredImageUrl}" ${lightboxData}>` : "";
    html += `<img src="${filteredImageUrl}" alt="${alt}" class="add-aspect-4x3">`;
    html += link ? `</a>` : "";
    html += content ? `<div>${content}</div>` : "";
    html += `</div>`;
    html += `</div>`;
    return html;
  });

  eleventyConfig.addPairedShortcode("process", (content) => {
    return `<ol class="usa-process-list">${content}</ol>`;
  });

  eleventyConfig.addPairedShortcode("processItem", (content, heading) => {
    return dedent`
      <li class="usa-process-list__item">
        <h4 class="usa-process-list__heading">${heading}</h4>
        <div class="margin-top-05"></div>
        ${md.render(content)}
      </li>`;
  });
};
