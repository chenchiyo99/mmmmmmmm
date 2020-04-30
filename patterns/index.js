const patternDict = [
{
	pattern: '\\b(?<greeting>Hi|Hello|Hey|How are you)\\b',
	intent: 'Hello'
},
{
	pattern: '\\b(bye|exit|see you|see ya)\\b',
	intent: 'Exit'
},
{
	pattern: 'like\\sin\\s\\b(?<city>.+)',
	intent: 'CurrentWeather'
},
/*{
	pattern: "\\b(?<weather>rain|rainy|sunny|cloudy|misty)\\b\\sin\\s
		b(?<city>[a-z]+[ a-z]+?)\\b(?<time>day after tomorrow|tomorrow|today)$",
	intent: "weatherForecast"
},*/
/*{
	"\\b(?<weather>rain|rainy|sunny|cloudy|misty)\\b\\s\\b(?<time>
		day after tomorrow|tomorrow|today)\sin\\s\\b(?<city>[a-z]+[ a-z]+?)$",
	intent: "weatherForecast"
}*/
];

module.exports = patternDict;