# liqour-prices-delhi
A scraper written using navalia to keep an up-to-date data of liquor prices in New Delhi

An React app created using the scrapped data is live @ https://delhiquor.surge.sh

clone the repo and yarn start to create your own latest json data
or
fetch the raw db.json file to use the data.

## Liquor-categories -
Foreign Liquor - Beer, Brandy, Gin, Rum, Vodka, Whiskey, Wine
Indian Liquor - Beer, Brandy, Draught Beer, Gin, Rum, Vodka, Whiskey, Wine 

## Structure -
```json
{
	"foreign-liquor-beer": [
		{
			"slNo": "1",
			"brandCode": "1968KSA",
			"brandName": "1698 KENTISH STRONG ALEL1F20153117",
			"size": "500",
			"pack": "1",
			"price": "350.00",
			"warehouse": "NORTHERN SPIRITS PVT. LTD."
		}
	]
}
```