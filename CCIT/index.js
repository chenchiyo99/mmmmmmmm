'use strict';

const crypto = require('crypto');
const request = require('request');
const apiVersion = 'v5.0';

class CCIT {
	constructor({ pageAccessToken, verifyToken, appSecret }) {
		try {
			if (pageAccessToken && verifyToken) {
				this.pageAccessToken = pageAccessToken;
				this.verifyToken = verifyToken;
				this.appSecret = appSecret;
			} else {
				throw "One or more tokens/credentials are missing!";
			}
		} catch (e) {
			console.log(e)
		}
	}
	


	// registerHook(reg, res) {
	// 	// const params = reg.query;
	// 	const mode = reg.query['hub.mode'],
	// 	 token = reg.query['hub.verify_token'],
	// 	 challenge = reg.query['hub.challenge'];
	// 	 // if mode === 'subscribe' and token === verifytoken, then send back challenge
	// 	 try{
	// 	 	if ((mode && token) && (mode === 'subscribe' && token === this.verifyToken)) {
	// 	 		 console.log("Webhook registered!");
	// 	 		 return res,send(challenge);
	// 	 	} else {
	// 	 		throw "Could not register webhook!";
	// 	 		return res.sendStatus(200);
	// 	 	}
	// 	 } catch(e) {
	// 	   console.log(e);
	// 	 }
	// }


	verifySignature(reg, res, buf) {
		return (reg, res, buf) => {
			if(reg.method === 'POST') {
				try {
					let signature = reg.headers['x-hub-signature'];
					if(!signature) {
						throw "Signature not received";
					} else {
						let hash = crypto.createHmac('sha1', this.appSecret).update(buf, 'utf-8');
						if(hash.digest('hex') !== signature.split("=")[1]) {
							throw "Invalid signature!";
						}
					}
				} catch(e) {
				  console.log(e);
				}
			}
		}
	}

	incoming(reg, res, cb) {
		res.sendStatus(200);
		if(reg.body.object === 'page' && reg.body.entry) {
			let data = reg.body;
			// console.log(data);
			data.entry.forEach(pageObj => {
				if(pageObj.messaging) {
					pageObj.messaging.forEach(messageObj => {
						if(messageObj.postback) {
							//Handle postbacks
						} else {
							//Handle message
							console.log(this.messageHandler(messageObj));
							return cb(this.messageHandler(messageObj));
						}
					});
				}
			});
		}
	}

	 messageHandler(obj) {
	 	let sender = obj.sender.id;
	 	let message = obj.message;

	 	if (message.text) {
	 		let obj = {
	 			sender,
	 			type: 'text',
	 			content: message.text
	 			// content:req.body.entry[0].messaging[0].message.text
	 		}

	 		return obj;
	 	}
	 }

	// sendMessage(payload) {
	// 	return new Promise((resolve, reject) => {
	// 		request({
	// 			url: 'https://graph.facebook.com/$(apiVersion)/me/messages',
	// 			qs: {
	// 				access_token: this.pageAccessToken
	// 			},
	// 			method: 'POST',
	// 			json: payload
	// 		}, (error, response, body) => {
	// 			console.log(response.statusCode);
	// 			if (!error && response.statusCode === 200) {
	// 				resolve({
	// 					mid: body.message_id

	// 				});
	// 				console.log('okay2');
	// 			} else {
	// 				reject(error);
	// 				console.log('okay1');
	// 			}
	// 		});
	// 	});

	// }

	sendMessage(payload) {
		return new Promise((resolve, reject) => {
			request({
				url: `https://graph.facebook.com/${apiVersion}/me/messages`,
				qs: {
					access_token: this.pageAccessToken
				},
				method: 'POST',
				json: payload
			}, (error, response, body) => {
				console.log(response.statusCode);
				if (!error && response.statusCode === 200) {
					resolve({
						mid: body.message_id

					});
					console.log('okay2');
				} else {
					reject(error);
					console.log('okay1');
				}
			});
		});

	}


	txt(id, text, messaging_type = 'RESPONSE') {
		let obj = {
			messaging_type,
			recipient: {
				id
			},
			message: {
				text
			}
		}
		console.log('okay');

		return this.sendMessage(obj);
	}


	img(id, url, messaging_type = 'RESPONSE') {
		let obj = {
			messaging_type,
			recipient: {
				id
			},
			message: {
				attachment: {
					type: 'image',
					payload: {
						url
					}
				}
			}
		}

		return this.sendMessage(obj);
	}
}

module.exports = CCIT;