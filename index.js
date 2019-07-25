const config = require('./config.json')
const Discord = require('discord.js');
const client = new Discord.Client();
const request = require('request');
const uuidv4 = require('uuid/v4');
const util = require('util');

function enToRu(message){
	let options = {
			method: 'POST',
			baseUrl: 'https://api.cognitive.microsofttranslator.com/',
			url: 'translate',
			qs: {
				'api-version': '3.0',
				'to': ['ru']
			},
			headers: {
				'Ocp-Apim-Subscription-Key': config.azurekey,
				'Content-type': 'application/json',
				'X-ClientTraceId': uuidv4().toString()
			},
			body: [{
						'text': message.content
			}],
			json: true,
	};

	request(options, function(err, res, body){
		if(err) {
			console.log(err);
			return;
		}
		var resp = JSON.stringify(body, null, 4);
		var abc = '"text": "'
		var tmp = resp.split(abc);
		var tpm = tmp[1].split('",');
		console.log(util.inspect(tpm[0]));

		var usernick = message.author.username;
		if (message.member.nickname) usernick = message.member.nickname;
		const niceEmbed = new Discord.RichEmbed()
			.setColor('#0099ff')
			.setAuthor(usernick, message.author.avatarURL)
			.setDescription(tpm[0])
			.setTimestamp()
			.setFooter('English? -> Russian');

		client.channels.get(config.russianchannel).send(niceEmbed);
		});
}

function ruToEn (message){
	let optionsru = {
			method: 'POST',
			baseUrl: 'https://api.cognitive.microsofttranslator.com/',
			url: 'translate',
			qs: {
				'api-version': '3.0',
				'to': ['en']
			},
			headers: {
				'Ocp-Apim-Subscription-Key': config.azurekey,
				'Content-type': 'application/json',
				'X-ClientTraceId': uuidv4().toString()
			},
			body: [{
						'text': message.content
			}],
			json: true,
	};

	request(optionsru, function(err, res, body){
		//console.log(util.inspect(body));
		if(err) {
			console.log(err);
			return;
		}
		var resp = JSON.stringify(body, null, 4);
		var abc = '"text": "'
		var tmp = resp.split(abc);
		var tpm = tmp[1].split('",');
		console.log(util.inspect(tpm[0]));

		var usernick = message.author.username;
		if (message.member.nickname) usernick = message.member.nickname;
		const niceEmbed = new Discord.RichEmbed()
			.setColor('#0099ff')
			.setAuthor(usernick, message.author.avatarURL)
			.setDescription(tpm[0])
			.setTimestamp()
			.setFooter('Russian? -> English');

		client.channels.get(config.englishchannel).send(niceEmbed);
	});

}


client.once('ready', () => {
	console.log('Ready!');
});
client.on('message', message => {
  if (message.author.bot) return;
	if (message.channel.id === config.englishchannel) {
		console.log(message.channel.id);
		enToRu(message);
	} else if (message.channel.id === config.russianchannel) {
		ruToEn(message);
	}
});



client.login(config.token);
