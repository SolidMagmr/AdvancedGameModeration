const client = require('discord.js')
const fs = require('fs')

module.exports = {
	name: 'newgame',
	description: 'Create a new table inside the database which will store the warns of the given game.', 
	aliasses: ['newtable', 'createtable', 'creategame'], 
	cooldown: 15, 
	guildOnly: true,
	usage: '<Table name> <UseCycles: true/false>',
	execute(message, args) {  
		console.log('Received the new command')
		var GameName = args[0].toLowerCase()
		var UseCycles = args[1].toLowerCase()
		if (UseCycles == "true" || UseCycles == "false") {

			const template = {
				"tablename" : GameName,
				"useCycles": UseCycles,
				"Cycle": 1,
			}

			fs.readFile('./gameinfo.json', 'UTF-8', function(err,data){
				if (err) throw err
				var existing = JSON.parse(data)

				var foundmatch = false
				existing.Games.forEach(element => {
					if(element.tablename == GameName) {foundmatch = true}
				});
				if(foundmatch == true) return message.channel.send('That name already exists.')

				existing.Games.push(template)

				fs.writeFile('./gameinfo.json', JSON.stringify(existing, null, '\t'), 'utf-8', function(err){
					if(err) throw err
					console.log('Added the game to the table!')
					message.channel.send(`The object ${GameName} has been added to the bot with useCycles set to ${UseCycles}`)
				})
			})

			
			
		} else{return message.channel.send("<UseCycles> was not a boolean, enter either true or false.")}
	},
};

