const Discord = require('discord.js');
const fs = require('fs')

module.exports = {
	name: 'games',
	description: 'Gives you an list of all aviable games', //Description of the command
	aliasses: ['Tables'], //If you want people to be able to use other names for the command write them here
	cooldown: 5, //In seconds
    guildOnly: true, //Only able to be used in the discord server itself
    usage:'Command itself', //If you want to set an correct usage of the command write them there, to keep everything conform put them between <>
	execute(message, args) { 
		
	fs.readFile('./gameinfo.json', 'UTF-8',function(err,data){
		if (err) throw err
		if (!message.member.hasPermission("KICK_MEMBERS", false, true, false)) return message.channel.send("You do not have the required permissions");

		var existing = JSON.parse(data)

		var infoembed = new Discord.MessageEmbed()
		.setTitle('Aviable games at the moment')
		.setColor('#34b5db')
		.setDescription('Displays all aviable games at this point in time')

		existing.Games.forEach(function(element,index){
			infoembed.addField(`Game number ${index +1}`, `Game name: **${element.tablename}**\nWith cycles set to **${element.useCycles}** currently on cycle **${element.Cycle}**`)

		})
		message.channel.send(infoembed)
	})
	
}
};