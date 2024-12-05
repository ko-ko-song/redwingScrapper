require("dotenv").config();
const refreshAccessToken = require("./getAccessToken");

let access_token = "";
let tryCount = 0;
async function sendKakaoMessage(message, webUrl) {
  tryCount++;
  if (tryCount > 3) {
    console.error("메시지 전송 실패... 종료");
    return;
  }

  try {
    const url = "https://kapi.kakao.com/v2/api/talk/memo/default/send";
    const templateObject = {
      object_type: "text",
      text: message,
      link: {
        web_url: webUrl,
        mobile_web_url: webUrl,
      },
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
        Authorization: `Bearer ${access_token}`,
      },
      body: `template_object=${encodeURIComponent(JSON.stringify(templateObject))}`,
    });

    if (response.status === 401) {
      const tokens = await refreshAccessToken();
      access_token = tokens.access_token;

      console.log("access_token 갱신 완료");
      return sendKakaoMessage(message, webUrl);
    }

    const data = await response.json();

    if (data.result_code === 0) {
      console.log("메시를 성공적으로 보냈습니다.");
      tryCount = 0;
    } else {
      console.log("메시지를 성공적으로 보내지 못했습니다. 오류메시지:", data);
    }
  } catch (error) {
    console.error("메시지 전송 실패:", error);
  }
}

async function sendKakaoListMessage(items, baseUrl) {
  tryCount++;
  if (tryCount > 3) {
    console.error("메시지 전송 실패... 종료");
    return;
  }

  try {
    const url = "https://kapi.kakao.com/v2/api/talk/memo/default/send";

    // 최대 3개의 아이템만 표시 (카카오 리스트 템플릿 제한)
    const limitedItems = items.slice(0, 3);

    const templateObject = {
      object_type: "list",
      header_title: "Red Wing 할인 상품 알림",
      header_link: {
        web_url: baseUrl,
        mobile_web_url: baseUrl,
      },
      contents: limitedItems.map((item) => ({
        title: item.description,
        description: `${item.price} (${item.savings})`,
        image_url: item.image,
        link: {
          web_url: item.link,
          mobile_web_url: item.link,
        },
      })),
      buttons: [
        {
          title: "전체 상품 보기",
          link: {
            web_url: baseUrl,
            mobile_web_url: baseUrl,
          },
        },
      ],
    };

    // 디버깅을 위한 로그
    // console.log("템플릿 오브젝트:", JSON.stringify(templateObject, null, 2));

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
        Authorization: `Bearer ${access_token}`,
      },
      body: `template_object=${encodeURIComponent(JSON.stringify(templateObject))}`,
    });

    if (response.status === 401) {
      const tokens = await refreshAccessToken();
      access_token = tokens.access_token;
      //   console.log("access_token 갱신 완료");
      return sendKakaoListMessage(items, baseUrl);
    }

    const data = await response.json();

    if (data.result_code === 0) {
      console.log("메시지를 성공적으로 보냈습니다.");
      tryCount = 0;
    } else {
      console.log("메시지를 성공적으로 보내지 못했습니다. 오류메시지:", data);
    }
  } catch (error) {
    console.error("메시지 전송 실패:", error);
    return false;
  }
  return true;
}

module.exports = {
  sendKakaoMessage,
  sendKakaoListMessage,
};
