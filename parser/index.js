"use strict";
const colors = require("colors");
const dictionary = require("./dictionary");

const getFeel = temp => {
	if (temp < 5) {
		return "shivering cold";
	} else if (temp >= 5 && temp < 15) {
		return "pretty cold";
	} else if (temp >= 15 && temp < 25) {
		return "moderately cold";
	} else if (temp >= 25 && temp < 32) {
		return "quite warm";
	} else if (temp >= 32 && temp < 40) {
		return "very hot";
	} else {
		return "super hot";
	} 
}

/*const getPrefix = (conditionCode, tense = "present") => {
	let findPrefix = dictionary[tense].find(item => {
		if (item.codes.index0f(Number(conditionCode)) > -1) {
			return true;
		}
	});

	return findPrefix.prefix || "";
}*/

const currentWeather = response => {
	if (response.location) {
		const {
			location, code, temperature
		} = response;

		return `Right now, in ${location}, it is ${getFeel(Number(temperature))} at ${String(temperature).red} degrees Celsius..`
	}
}

const forecastWeather = (response, data) => {
	if (response.location) {
		let parserDate = getDate(data.time); //convert 'tomorrow', 'day after tomorrow' into YYYY-MM-DD
		let { location } = response;
		let regEx = new RegEx(data.weather,"i");
		let testConditions = regEx.test(condition); //true or false
		return `${testConditions ? "Yes" : "No"}, ${getPrefix(code, "future")} ${condition.toLowerCase}`
	}
}

module.exports = {currentWeather}