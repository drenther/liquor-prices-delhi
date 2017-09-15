const { Chrome } = require('navalia');
const fs = require('fs');
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
			.join('-')}-${cat
			.toLowerCase()
			.split(' ')
			.join('-')}`
	] = result;
};

async function main() {
	await populateDb('Foreign Liquor', 'Beer');
	await populateDb('Foreign Liquor', 'Brandy');
	await populateDb('Foreign Liquor', 'Gin');
	await populateDb('Foreign Liquor', 'Rum');
	await populateDb('Foreign Liquor', 'Vodka');
	await populateDb('Foreign Liquor', 'Whisky');
	await populateDb('Foreign Liquor', 'Wine');
	await populateDb('Indian Liquor', 'Beer');
	await populateDb('Indian Liquor', 'Brandy');
	await populateDb('Indian Liquor', 'Draught Beer');
	await populateDb('Indian Liquor', 'Gin');
	await populateDb('Indian Liquor', 'Rum');
	await populateDb('Indian Liquor', 'Vodka');
	await populateDb('Indian Liquor', 'Whisky');
	await populateDb('Indian Liquor', 'Wine');
	fs.writeFile('./db.json', JSON.stringify(db), 'utf-8', err => {
		if (err) console.error(err);
		console.log('Successfully scraped!');
	});
}

main();
