const Discord = require('discord.js');
const arg = require('arg')
const yargs = require('yargs/yargs')

module.exports = {
	name: 'ping',
	description: 'Dev test command', //Description of the command
	aliasses: ['devtest', 'consolelog',], //If you want people to be able to use other names for the command write them here
	cooldown: 5, //In seconds
    guildOnly: false, //Only able to be used in the discord server itself
    usage:'Just the command', //If you want to set an correct usage of the command write them there, to keep everything conform put them between <>
	execute(message, args) {  //Add code of the command here if you need 'Global' values, add them with a , seperated after the args and do the same in index.js
		//console.log(message)

		const muteRole = message.guild.roles.cache.find(r => r.name === "Muted")
		
		if(!muteRole) {
			message.channel.send('No muted role has been found, creating one')

			try{
			const muterole = message.guild.roles.create({data: {name: 'Muted'}}) //creates the new role
			}
			catch(error){
				console.error(error)
				return message.channel.send('Could not create a new role, do I have the required permissions?')
			}

		}
		
		

		//console.log(message.guild.roles)
		//console.log(Discord)
	},
};