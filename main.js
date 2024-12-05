const searchSierraRedWing = require("./searchItem");
const { sendKakaoMessage, sendKakaoListMessage } = require("./sendKakaoMessage");

//"moc-toe",
const base_url = "https://www.sierra.com";
const targetUrl = "https://www.sierra.com/s~red-wing";
const keywords = ["ranger", "smith"];

let exItems = [];

async function main() {
  await searchItemAndSendMessage();

  setInterval(async () => {
    const now = new Date();
    const hour = now.getHours();
    try {
      if (hour >= 9 && hour <= 23) {
        await searchItemAndSendMessage();
      }
    } catch (error) {}
  }, 30 * 60 * 1000);
}

function updateExItems(items) {
  let newItems = [];
  for (const item of items) {
    newItems.push(item.description);
  }
  exItems = newItems;
}

function isSameItmes(items) {
  let isSame = true;
  for (const item of items) {
    if (!exItems.includes(item.description)) {
      isSame = false;
      break;
    }
  }
  return isSame;
}

async function searchItemAndSendMessage(retryCount = 0) {
  const now = new Date();
  console.log(
    `${now.getFullYear()}-${
      now.getMonth() + 1
    }-${now.getDate()} ${now.getHours()}:${now.getMinutes()} searchItemAndSendMessage`
  );
  try {
    const items = await searchSierraRedWing(targetUrl, keywords, base_url);

    if (items.length > 0 && !isSameItmes(items)) {
      const result = await sendKakaoListMessage(items, targetUrl);
      if (result) updateExItems(items);
    }
  } catch (error) {
    console.error(error);
    if (retryCount < 3) {
      console.log(`retry...  ${retryCount}`);
      return await searchItemAndSendMessage(retryCount + 1);
    }
  }
}
// searchItemAndSendMessage();
main();
