console.log(`Getting cookies...`)
chrome.runtime.sendMessage({domain: "facebook.com"}, async (response) => {
    console.log("Response: ", response);
});