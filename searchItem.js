const { JSDOM } = require("jsdom");

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

    const html = await response.text();
    const dom = new JSDOM(html);
    const document = dom.window.document;

    const foundItems = [];

    // 모든 제품 카드 선택 (더 구체적인 선택자 사용)
    const productCards = document.querySelectorAll(".productThumbnailContainer.item");

    productCards.forEach((card) => {
      // 제품명 추출
      const titleElement = card.querySelector(".productCard-title-name a");
      const description = titleElement?.textContent?.trim();

      // 링크 추출
      const link = titleElement?.getAttribute("href") ? base_url + titleElement.getAttribute("href") : "";

      // 가격 정보 추출 (선택자 수정)
      const priceElement = card.querySelector(".ourPrice");
      const currentPrice = priceElement?.textContent?.trim();
      const compareElement = card.querySelector(".retailPrice");
      const savingsElement = card.querySelector(".productSavings");
      const savings = savingsElement?.textContent?.replace("Save ", "할인율")?.trim();

      const comparePrice = compareElement?.textContent?.replace("Compare at ", "")?.trim();

      // 이미지 URL 추출
      const imageElement = card.querySelector(".productThumbnail");
      const image = imageElement?.getAttribute("src");

      // 검색 키워드와 매칭되는 제품만 추가
      const matchesKeyword = searchKeywords.some((keyword) =>
        description?.toLowerCase().includes(keyword.toLowerCase())
      );

      if (description && matchesKeyword) {
        foundItems.push({
          description,
          link,
          price: currentPrice,
          savings: savings,
          comparePrice,
          image,
        });
      }
    });

    return foundItems;
  } catch (error) {
    console.error("에러 발생:", error);
    return [];
  }
};
