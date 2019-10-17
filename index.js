const config = require('./config.json')
const Discord = require('discord.js');
const client = new Discord.Client();
const request = require('request');
const uuidv4 = require('uuid/v4');
const util = require('util');

function isOdd(num) { return (num % 2);}

async function sendAttachments(attach, chan, nickname) {
	client.channels.get(chan).send("Attachment by " + nickname + ": " + attach);
}

async function translateMsg(message, lang, channel){
	var usernick = message.author.username;
	if (message.member.nickname) usernick = message.member.nickname;

	if (message.attachments.first()) {
    console.log(message.attachments.first().url);
    var attachUrl = message.attachments.first().url;
    sendAttachments(attachUrl, channel, usernick);
  }
	if (message == "") return;
	var translate = require('yandex-translate')(config.key);
	translate.translate(message.content, { to: lang }, function(err, res) {
		if(err) {
			console.log(err);
			return;
		}

		var tltedmsg = res.text + "\n\nPowered by Yandex.Translate http://translate.yandex.com/"

		const niceEmbed = new Discord.RichEmbed()
			.setColor('#0099ff')
			.setAuthor(usernick, message.author.avatarURL)
			.setDescription(tltedmsg)
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
			//console.log("Message read!");
				var z = i;
				if (isOdd(i)) {	z--; } else z++;
				translateMsg(message, config.languages[i], config.channellist[z]);
				return; // No need to stay on the loop
		}
	}
});


client.login(config.token);
