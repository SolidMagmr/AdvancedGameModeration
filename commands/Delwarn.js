const Discord = require('discord.js');


module.exports = {
	name: 'delwarn',
	description: 'Deletes a warn', 
	aliasses: ['deletewarn', 'removewarn', 'destroywarn', 'unwarn'], 
	cooldown: 5, 
    guildOnly: true, 
    usage:'<Username>', 
	execute(message, args, Warns) {  

		if (!message.member.hasPermission("KICK_MEMBERS", false, true, false)) return message.channel.send("You do not have the required permissions");

		var nameUser = args[0]
		
		var nodesc = 'No description given'

		const awaitfiltertitle = m=> m.author.id === message.author.id;
		
		Warns.findAll({where: {name:nameUser}}).then(collected => {

			message.channel.send(`There were ${collected.length} entries found, which one of these do you want to remove?`)

			var foundwarns = new Discord.MessageEmbed()
			.setColor('#34b5db')
			.setTitle(`Warns found in the database of user ${nameUser}`)
			collected.forEach(function(item, index) {
				foundwarns.addField(`Warn nr.${index +1} with description:`, `${item.description || nodesc}`)

			})

			var selectedwarn = null

			message.channel.send(foundwarns)
			message.channel.send('Which ones of these would you like to remove?')
			message.channel.awaitMessages(awaitfiltertitle, {max:1, time:30000}).then(found =>{
			var integerr = parseInt(found.first().content)

			//console.log(typeof integerr)
			//console.log(found.first().content)

			if (typeof integerr === 'number') {
			selectedwarn = integerr
			message.channel.send(`You selected warn number ${integerr}`)
			//console.log(selectedwarn)
			collected[selectedwarn - 1].destroy()
		
		
		}
			else return message.channel.send('Looks like the provided warn isn\'t a number or you didn\'t provide a numer in time')	
			
			})

		
				

		}
			)
		
		console.log(message + args)
	},
};