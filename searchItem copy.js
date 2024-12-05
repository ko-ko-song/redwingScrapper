module.exports = async function searchSierraRedWing(url, searchKeywords, base_url) {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();
    const lines = text.split("\n");
    const foundItems = [];

    searchKeywords.forEach((keyword) => {
      lines.forEach((line, index) => {
        if (line.toLowerCase().includes(keyword.toLowerCase())) {
          const titleRegex = /title="([^"]*)"/;
          const titleMatch = line.match(titleRegex);

          const linkRegex = /<a[^>]*href=["']([^"']*)["'][^>]*>/g;
          let match;
          while ((match = linkRegex.exec(line)) !== null) {
            const link = base_url + match[1];
            if (titleMatch) {
              const description = titleMatch[1];
              const isReview = description.toLowerCase().includes("review");
              const isDuplicate = foundItems.some((item) => item.description === description);

              if (!isReview && !isDuplicate) {
                foundItems.push({
                  description: description,
                  link: link,
                });
              }
            }
          }
        }
      });
    });

    const filteredItems = foundItems.filter((item) =>
      searchKeywords.some((keyword) => item.link.toLowerCase().includes(keyword.toLowerCase()))
    );

    return filteredItems;
  } catch (error) {
    console.error("에러 발생:", error);
    return [];
  }
};
