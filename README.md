# Rotranslator
Discord channel translator!

Simple and full of bugs Discord bot that uses Microsoft's Azure API to translate between two Discord channels.

# Installation

Clone it..
`git clone https://github.com/Zelop/Rotranslator/`

Install dependencies..
`npm install`

# Setting up config.json

You have to add the desired channels (Channel ID) to translate from/to to "channellist", then for each of those, add the language you want it **TO TRANSLATE INTO** in "languages". (Azure API will autodetect the language)

**Example**
```
{
	"token": "DISCORD BOT TOKEN HERE",
	"azurekey": "AZURE API KEY HERE",
	"channellist": ["12345", "67890", "1111", "3333"],
	"languages": ["ru", "en", "es", "fr"]
}
```
Bot will translate whatever is written on channel 12345 to ru and write it on channel 67890.

67890 will be translated to english and written on 12345 channel.

1111 will be translated to spanish and written on 3333 channel.

Easy.

# Running it
`node index.js`

# More than one language
If you want to translate to different languages/channel, you'll have to comment out the "return;" inside the for loop, and write the origin channel again for each new translation. (Or you could just write a better bot :))
