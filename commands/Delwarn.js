const Discord = require('discord.js');
const fs = require('fs');

module.exports = {
	name: 'delwarn',
	description: 'Deletes a warn', 
	aliasses: ['deletewarn', 'removewarn', 'destroywarn', 'unwarn'], 
	cooldown: 5, 
    guildOnly: true, 
    usage:'<Username> or <Tag discord user>', 
	execute(message, args, Warns) {  

	if (!message.member.hasPermission("KICK_MEMBERS", false, true, false)) return message.channel.send("You do not have the required permissions");

    var username = args[0]
    if(!username) {return message.channel.send(`Atleast one argument must be provided`)}
    var totalfilter = args.slice(1).join(' ')

 

    var warnobject = {

    }
    
        
        fs.readFile('./gameinfo.json', 'UTF-8', function(err,data){
            if (err) throw err
            var existing = JSON.parse(data)

            var itemProcessed = 0;
            var foundmatch = 'no' // because booleans suck in my expperience I just use string, not efficient but please fix this if you want :)

            if(message.mentions.users.first()) {  //The case where no game is provided and it automates to a discord warn, use the message.mentions.first() to get warndata

                existing.Games.forEach(function(element, index, array){
                    if(element.tablename == 'discord'){

						var discorduser = message.mentions.users.first()
						var nodesc = 'No description given'
						warnobject.extra = discorduser.id
						foundmatch = 'yes'

						const awaitfiltertitle = m=> m.author.id === message.author.id;
		
						Warns.findAll({where: warnobject}).then(collected => {

							message.channel.send(`There were ${collected.length} entries found, which one of these do you want to remove?`)

							var foundwarns = new Discord.MessageEmbed()
							.setColor('#34b5db')
							.setTitle(`Warns found in the database of user ${discorduser.username}`)
							collected.forEach(function(item, index) {
							foundwarns.addField(`Warn nr.${index +1} with description:`, `${item.description || nodesc}`)

						})

						var selectedwarn = null

						message.channel.send(foundwarns)
						message.channel.send('Which ones of these would you like to remove?')
						message.channel.awaitMessages(awaitfiltertitle, {max:1, time:30000}).then(found =>{
						var integerr = parseInt(found.first().content)



						if (typeof integerr === 'number') {
							selectedwarn = integerr
							message.channel.send(`You selected warn number ${integerr}`)
							collected[selectedwarn - 1].destroy()
		
		
						}
						else return message.channel.send('Looks like the provided warn isn\'t a number or you didn\'t provide a numer in time')	
			
					})

				}
					)
    
                    }
    
                    itemProcessed++;
                    if (itemProcessed === array.length) {
                        if(foundmatch == 'no') {
                            return message.channel.send(`The is no discord object created or you forgot to specify what game you want to warn on. See **m!help warn** for more info`) //Checks if discord isn't found
                        }
                        
                    }
    
                })   

            } else { //If it isn't a discord specific warn, search if there is a special case for a special game, otherwise execute the default

                 foundmatch = 'yes'
                          		
					var nodesc = 'No description given'
					warnobject.name = username

					const awaitfiltertitle = m=> m.author.id === message.author.id;
		
					Warns.findAll({where: warnobject}).then(collected => {

						message.channel.send(`There were ${collected.length} entries found, which one of these do you want to remove?`)

						var foundwarns = new Discord.MessageEmbed()
						.setColor('#34b5db')
						.setTitle(`Warns found in the database of user ${username}`)
						collected.forEach(function(item, index) {
						foundwarns.addField(`Warn nr.${index +1} with description:`, `${item.description || nodesc}`)

						})

					var selectedwarn = null

					message.channel.send(foundwarns)
					message.channel.send('Which ones of these would you like to remove?')
					message.channel.awaitMessages(awaitfiltertitle, {max:1, time:30000}).then(found =>{
					var integerr = parseInt(found.first().content)



					if (typeof integerr === 'number') {
						selectedwarn = integerr
						message.channel.send(`You selected warn number ${integerr}`)
						collected[selectedwarn - 1].destroy()
	
		
					}
					else return message.channel.send('Looks like the provided warn isn\'t a number or you didn\'t provide a numer in time')	
			
					})

				}
				)
                
            }      
        })
	},
};