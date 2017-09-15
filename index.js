const { Chrome } = require('navalia');
const chrome = new Chrome();

const db = {};

const populateDb = async (type, cat) => {
	await chrome.goto('https://delhiexcise.gov.in/Portal/priceList.action');
	await chrome.evaluate(val => {
		const el = document.querySelector('#liqTypeId');
		el.value = val;
		el.onchange();
	}, type);
	await chrome.wait(1000);
	await chrome.evaluate(val => {
		const el = document.querySelector('#liqCategoryId');
		el.value = val;
		el.onchange();
	}, cat);
	await chrome.wait(1000);
	await chrome.evaluate(() => window.showAll());
	await chrome.wait(1000);
	await chrome.evaluate(() => window.hidePagination());
	await chrome.wait(1000);
	const result = await chrome.evaluate(() => {
		return [
			...document.querySelectorAll(
				'#priceListTable tbody tr:not(:first-child)'
			),
		]
			.map(n =>
				n.innerHTML
					.split('>')
					.filter(x => x.includes('</'))
					.map(x => x.substr(0, x.length - 4))
			)
			.reduce((a, x) => {
				const drinks = [...a];
				drinks.push({
					slNo: x[0],
					brandCode: x[1],
					brandName: x[2],
					size: x[3],
					pack: x[4],
					price: x[5],
					warehouse: x[6],
				});
				return drinks;
			}, []);
	});
	db[
		`${type
			.toLowerCase()
			.split(' ')
			.join('-')}-${cat.toLowerCase()}`
	] = result;
};

async function main() {
	await populateDb('Foreign Liquor', 'Whisky');
	await populateDb('Foreign Liquor', 'Beer');
	await populateDb('Indian Liquor', 'Whisky');
	await populateDb('Indian Liquor', 'Beer');
	console.log(Object.keys(db).map(x => db[x].length));
}

main();
