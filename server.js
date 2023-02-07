const axios = require('axios');
const cheerio = require("cheerio");

const main = async (maxPages = 2) => {
    const paginationUrlsToVisit = ['https://scrapeme.live/shop'];
    const visitedPages = [];
    const products = new Set();
    while (paginationUrlsToVisit.length !== 0 ||
        visitedPages.length <= maxPages 
    ) {
        const url = paginationUrlsToVisit.pop();
        const htmlPage = await axios.get(url);
        const $ = cheerio.load(htmlPage.data)

        $(".page-numbers a").each((k, element) => {
            const paginationURL = $(element).attr("href");

            if (!paginationUrlsToVisit.includes(paginationURL) &&
                !visitedPages.includes(paginationURL)) {
                paginationUrlsToVisit.push(paginationURL);
            }
        })


        $("li.product a.woocommerce-LoopProduct-link").each((k, element) => {
            const productURL = $(element).attr("href");
            products.add(productURL);
        });
    }

    console.log([...products])

}


main()