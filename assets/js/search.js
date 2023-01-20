(function (window, document, pathPrefix) {
  if (pathPrefix === undefined) {
    pathPrefix = "";
  }

  function initSearch() {
    const searchQuery = getSearchQuery();

    if (searchQuery) {
      fetch(pathPrefix + "/searchindex.json").then((res) => {
        res.json().then((indexData) => {
          window.searchIndex = elasticlunr.Index.load(indexData);
          performSearch(searchQuery);
        });
      });
    }
  }

  function getSearchQuery() {
    const params = window.location.search.replace(/^\?/, "").split("&");

    for (let paramIndex in params) {
      const [key, value] = params[paramIndex].split("=");
      if (key === "search") {
        return decodeURIComponent(value.replace(/\+/g, " "));
      }
    }
  }

  function performSearch(query) {
    document.querySelectorAll("input[type='search']").forEach(field => field.value = query);

    const results = window.searchIndex.search(query, {});

    const $results = document.querySelector("#search-results");
    const $noResults = document.querySelector("#search-no-results");

    $results.innerHTML = "";

    if (results.length > 0) {
      $noResults.style.display = "none";
      results.map((result) => {
        const { id, title, excerpt } = window.searchIndex.documentStore.getDoc(result.ref);
        const $result = document.createElement("div");
        $result.classList.add("margin-y-2");
        $results.appendChild($result);

        const $title = document.createElement("h3");
        $title.classList.add("font-sans-md", "margin-0");
        $result.appendChild($title);

        const $link = document.createElement("a");
        $link.setAttribute("href", id);
        $link.textContent = title;
        $title.appendChild($link);

        const $url = document.createElement("p");
        $url.classList.add("margin-0", "text-base-light");
        $url.textContent = id;
        $result.appendChild($url);

        const $excerpt = document.createElement("p");
        $excerpt.classList.add("margin-0");
        $excerpt.textContent = excerpt;
        $result.appendChild($excerpt);
      });
    } else {
      $noResults.style.display = "block";
    }
  }

  initSearch();
})(window, document, pathPrefix);
