const getAllCookies = async () => {
  const cookies = chrome.cookies.getAll({});
  return cookies;
};

const getCookiesByDomain = async (domainRegex) => {
  const allCookies = await getAllCookies();
  const cookies = allCookies.filter((cookie) => domainRegex.test(cookie.domain));
  return mapCookies(cookies);
};

const mapCookies = (cookies) => {
  const groupedCookies = {};
  for (const cookie of cookies) {
    if (groupedCookies[cookie.domain]) {
      groupedCookies[cookie.domain] = [...groupedCookies[cookie.domain], cookie]
    } else {
      groupedCookies[cookie.domain] = []
    }
  }
  const mappedCookies = Object.keys(groupedCookies).map(key => {
    return {
      url: key,
      cookies: groupedCookies[key]
    }
  })
  return mappedCookies;
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  console.log("Received msg:", msg);
  //   getAllCookies().then((cookies) => sendResponse(cookies));
  getCookiesByDomain(/facebook.com/).then((cookies) => sendResponse(cookies)).catch(error => sendResponse(null));
  return true;
});
