console.log(`1... 2... 3`)
chrome.runtime.sendMessage({domain: "facebook.com"}, async (response) => {
    console.info("Open back ground for more information");
});