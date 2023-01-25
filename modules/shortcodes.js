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
    const { name } = args || {};
    if (name && this.ctx.galleries && this.ctx.galleries[name]) {
      const gallery = this.ctx.galleries[name];
      const galleryItem = eleventyConfig.javascriptFunctions.galleryItem;
      gallery.forEach(photo => {
        content += galleryItem(photo.title, {
          src: photo.src || "",
          alt: photo.alt || "",
          link: true
        });
      });
    }
    return `<div class="grid-row grid-gap wp-mini-gallery">${content}</div>`;
  });

  eleventyConfig.addPairedShortcode("galleryItem", (content, args) => {
    const { src, alt, link } = args || {};
    const filteredImageUrl = eleventyConfig.getFilter("url")(src);
    let html = `<div class="grid-col-4 margin-y-2">`;
    html += `<div>`;
    html += link ? `<a href="${src}">` : "";
    html += `<img src="${filteredImageUrl}" alt="${alt}" class="add-aspect-4x3">`;
    html += link ? `</a>` : "";
    html += content ? `<div>${content}</div>` : "";
    html += `</div>`;
    html += `</div>`;
    return html;
  });
};
