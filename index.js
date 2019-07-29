const config = require('./config.json')
const Discord = require('discord.js');
const client = new Discord.Client();
const request = require('request');
const uuidv4 = require('uuid/v4');
const util = require('util');

// How does it work for now?
/*
Just go to config.json.
First channel in channellist will translate to second channel and viceversa. Same with 3rd and 4th channel.
First language in languages is the language you want THE FIRST CHANNEL TO TRANSLATE INTO. Second for the second channel.
Origin language isn't needed, Azure api will autodetect it.
*/

function isOdd(num) { return (num % 2);}

function translateMsg(message, lang, channel){
	let options = {
			method: 'POST',
			baseUrl: 'https://api.cognitive.microsofttranslator.com/',
			url: 'translate',
			qs: {
				'api-version': '3.0',
				'to': [lang]
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
		//console.log(util.inspect(tpm[0]));

		var usernick = message.author.username;
		if (message.member.nickname) usernick = message.member.nickname;
		const niceEmbed = new Discord.RichEmbed()
			.setColor('#0099ff')
			.setAuthor(usernick, message.author.avatarURL)
			.setDescription(tpm[0])
			.setTimestamp()
			.setFooter(`Translated to ${lang}`);

		client.channels.get(channel).send(niceEmbed);
		});
}


client.once('ready', () => {
	if (config.channellist.length < '2' || isOdd(config.channellist.length))
	{
		console.log(`Error! Not enough channels (Channels = ${config.channellist.length}) in config.json. Bot won't work properly (if at all)`);
		return;
	} else console.log('Ready!');
});
client.on('message', message => {
  if (message.author.bot) return;
	var i = 0;
	for (i = 0; i < config.channellist.length; i++){
		if (message.channel.id === config.channellist[i]) {
				var z = i;
				if (isOdd(i)) {	z--; } else z++;
				translateMsg(message, config.languages[i], config.channellist[z]);
				return;	// No need to stay on the loop
		}
	}
});


client.login(config.token);
