const { Chrome } = require('navalia');

const chrome = new Chrome();

// foreign beers catalog

(async () => {
	await chrome.goto('https://delhiexcise.gov.in/Portal/priceList.action');

	await chrome.evaluate(() => {
		const el = document.querySelector('#liqTypeId');
		el.value = 'Foreign Liquor';
		el.onchange();
	});

	await chrome.wait(1000);

	await chrome.evaluate(() => window.showAll());

	await chrome.wait(1000);

	await chrome.evaluate(() => window.hidePagination());

	await chrome.wait(1000);

	const res = await chrome.evaluate(() => {
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
			.reduce(
				(a, x) => {
					const beers = [...a.beers];
					beers.push({
						slNo: x[0],
						brandCode: x[1],
						brandName: x[2],
						size: x[3],
						pack: x[4],
						price: x[5],
						warehouse: x[6],
					});
					a.beers = beers;
					return a;
				},
				{ beers: [] }
			);
	});

	console.log(res);

	chrome.done();
})();
