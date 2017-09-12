const puppeteer = require('puppeteer');

const LIQTYPE = process.argv[2] || "Foreign Liquor";
const LIQCAT = process.argv[3] || "Beer";
const BRAND = process.argv[4] || "";

const url = "https://delhiexcise.gov.in/Portal/priceList.action";

(async () => {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	
	await page.goto(url);
	console.log(await page.title());
	
	const setOptions = async (LIQTYPE, LIQCAT) => {
		await page.evaluate((LIQTYPE) => {
			const liqTypeId = document.querySelector("#liqTypeId");
			liqTypeId.value = LIQTYPE;
			liqTypeId.onchange();
			return true;
		});
		
		await page.evaluate((LIQCAT) => {
			const liqCatId = document.querySelector("#liqCategoryId");
			liqCatId.value = LIQCAT;
			liqCatId.onchange();
			return true;
		});
		
		return true;
	};
	
	await page.waitFor(setOptions(LIQTYPE, LIQCAT))
	
	await page.click("#search");
	
	await page.screenshot({path: 'test.png'});
	
	await page.close();
	await browser.close();
})();