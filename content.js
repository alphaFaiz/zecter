console.log(`1... 2... 3`)
chrome.runtime.sendMessage({message: "hello"}, async (response) => {
    console.info("Open back ground for more information");
});