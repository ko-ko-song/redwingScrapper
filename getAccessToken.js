require("dotenv").config();

const REST_API_KEY = process.env.REST_API_KEY;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

module.exports = async function refreshAccessToken() {
  try {
    const url = "https://kauth.kakao.com/oauth/token";
    const data = new URLSearchParams({
      grant_type: "refresh_token",
      client_id: REST_API_KEY,
      refresh_token: REFRESH_TOKEN,
    });

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
      body: data,
    });

    const newTokens = await response.json();
    console.log("새로운 토큰:", newTokens);
    return newTokens;
  } catch (error) {
    console.error("토큰 갱신 실패:", error);
    throw error;
  }
};
// refreshKakaoToken();

// 아래의 링크로 브라우저에서 접속하면 redirect된 url의 params에 code가 있음 그걸로 첫 access token과 refresh token 발급
// https://kauth.kakao.com/oauth/authorize?client_id={REST API 키}&redirect_uri=https://localhost:3000&response_type=code&scope=talk_message
// getKakaoAccessToken(REST_API_KEY, CODE);

// first get token
// const codeUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=https://localhost:3000&response_type=code&scope=talk_message`;
// console.log(codeUrl);
// fetch(codeUrl)
//   .then((res) => res.json())
//   .then((data) => console.log(data));
// async function getKakaoAccessToken(restApiKey, code) {
//   try {
//     const url = "https://kauth.kakao.com/oauth/token";
//     const data = new URLSearchParams({
//       grant_type: "authorization_code",
//       client_id: restApiKey,
//       redirect_uri: "https://localhost:3000",
//       code: code,
//     });

//     const response = await fetch(url, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
//       },
//       body: data,
//     });

//     const tokens = await response.json();
//     console.log("토큰:", tokens);
//     return tokens;
//   } catch (error) {
//     console.error("토큰 발급 실패:", error);
//   }
// }
