'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config');
const http = require('http');
const CCIT = require('./CCIT');
//CCITBot
const matcher = require('./matcher');
const weather = require('./weather');
const { currentWeather , forecastWeather } = require('./parser');

const server = express();
const PORT = process.env.PORT || 8080;
const c = new CCIT(config.fb);

// create a health check endpoint
server.get('/health', function(reg, res) {
  res.send('okay');
});

// server.get('/fb', (reg, res) => c.registerHook(reg.res));
server.get('/fb', function(reg, res) {
  if (reg.query['hub.verify_token'] === 'abc') {
     res.send(reg.query['hub.challenge']);
   } else {
     res.send('Error, wrong validation token');
   }
});
 server.post('/fb', bodyParser.json({
 	verify: c.verifySignature
 }));
 server.post('/fb', function(reg, res,next){
   // console.log(JSON.stringify(reg.body))
   // res.send(reg.body)
   	//Messenger will be received here if the signature gose through
	//we will pass the message to CCIT for parsing
	return c.incoming(reg, res, data => {
		console.log(data.content);
		try {
				if(data.type === 'text') {
					matcher(data.content, async resp => {
						switch(resp.intent) {
							case 'Hello':
							 await c.txt(data.sender, `${resp.entities.greeting} to you too`);
							 break;
							case 'Exit':
							 await c.txt(data.sender, 'Have a nice day!');
							 break;
							case 'CurrentWeather':
							 await c.txt(data.sender, 'Let me check...');
							 let cwData = await weather(resp.entities.city, 'Current');
							 let cwResult = currentWeather(cwData);
							 await c.txt(data.sender, cwResult);
							 break;
							case 'WeatherForecast':
							 await c.txt(data.sender, 'Let me check...');
							 let wfData = await weather(resp.entities.city);
							 let wfResult = await forecastWeather(wfData, resp.entities);
							 await c.txt(data.sender, wfResult);
							 break;
							default: {
								await c.txt(data.sender, "I don't know what you mean :(");
							}
						}
					});
				}
			// if(data.content === 'hi there') {
				
			//  await c.txt(data.sender, 'Hey from CCITBOT!');
			//  await c.img(data.sender, 'https://i.pinimg.com/474x/fd/a1/3b/fda13b9d6d88f25a9d968901d319216a.jpg');
			// }
		} catch(e) {
			console.log('okay4');
			console.log(e);
			console.log('okay4');

		}
	});
 })
// server.post('/fb', (reg, res, next) => {
// 	//Messenger will be received here if the signature gose through
// 	//we will pass the message to CCIT for parsing
// 	return c.incoming(reg, res, async data => {
// 		try {
// 			if(data.content === 'hi there') {
// 				await c.txt(data.sender, 'Hey from CCITBOT!');

// 			}
// 		} catch(e) {
// 			console.log(e);

// 		}
// 	});
// })
http.createServer(server).listen(PORT, () => console.log(`CCIT Bot Service runnnig on Port ${PORT}`));