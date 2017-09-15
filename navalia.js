const { Chrome } = require('navalia');
const chrome = new Chrome();

(async () => {
	await chrome.goto('https://delhiexcise.gov.in/Portal/priceList.action');

	const wait = async () => {
		await chrome.wait(1000);
		await chrome.evaluate(() => window.showAll());
		await chrome.wait(1000);
		await chrome.evaluate(() => window.hidePagination());
		await chrome.wait(1000);
	};

	const setOptions = async (type, cat) => {
		await chrome.wait('#liqTypeId');
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
	};

	const getJSON = async () => {
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
				const beers = [...a];
				beers.push({
					slNo: x[0],
					brandCode: x[1],
					brandName: x[2],
					size: x[3],
					pack: x[4],
					price: x[5],
					warehouse: x[6],
				});
				return beers;
			}, []);
	};

	await setOptions('Foreign Liqour', 'Whisky');
	await wait();
	const result = await getJSON();

	console.log(result);
	chrome.done();
})();
