"use strict";
const axios = require("axios");
const apiKey = "67281a75482cbb8caabb544274f932b3";


const formatData = data => {
	return {
		location: `${data.location.name}, ${data.location.country}` ,
		temperature: data.current.temperature
		/*code: data.forecast.forecastday.map(day => {
			return {
				data: day.date,
				code: dat.day.condition.code,
				condition: day.day.condition.text
			}
		}
		)*/
	}
}
/*const params = {
  access_key: apiKey,
  query: formatData.location
}*/
const getWeather = location => {
	return new Promise(async (resolve, reject) => {
		try {
			const weatherConditions = await axios.get(
				"http://api.weatherstack.com/current",
				{
					params: {
						access_key: apiKey,
						query: location
					}
				});

			resolve(formatData(weatherConditions.data));
		} catch (error) {
			reject(error);
		}
	}); 
}

module.exports = getWeather;