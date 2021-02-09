const Discord = require('discord.js');
const fs = require('fs');

module.exports = {
	name: 'delmute',
	description: 'Deletes a mute from the database', 
	aliasses: ['deletemute', 'removemute', 'destroymute', 'unmute'], 
	cooldown: 5, 
    guildOnly: true, 
    usage:'<Username> or <Tag discord user>', 
	execute(message, args, Warns, Mutes) {  

	if (!message.member.hasPermission("KICK_MEMBERS", false, true, false)) return message.channel.send("You do not have the required permissions");

    var username = args[0]
    if(!username) {return message.channel.send(`Atleast one argument must be provided`)}
    var totalfilter = args.slice(1).join(' ')

 

    var muteobject = {

    }
    
        
        fs.readFile('./gameinfo.json', 'UTF-8', function(err,data){
            if (err) throw err
            var existing = JSON.parse(data)

            var itemProcessed = 0;
            var foundmatch = 'no' // because booleans suck in my expperience I just use string, not efficient but please fix this if you want :)

            if(message.mentions.users.first()) {  //The case where no game is provided and it automates to a discord mute, use the message.mentions.first() to get mutedata

                existing.Games.forEach(function(element, index, array){
                    if(element.tablename == 'discord'){

						var discorduser = message.mentions.users.first()
						var nodesc = 'No description given'
                        muteobject.extra = discorduser.id
                        foundmatch = 'yes'

						const awaitfiltertitle = m=> m.author.id === message.author.id;
		
						Mutes.findAll({where: muteobject}).then(collected => {

							message.channel.send(`There were ${collected.length} entries found, which one of these do you want to remove?`)

							var foundmutes = new Discord.MessageEmbed()
							.setColor('#34b5db')
							.setTitle(`mutes found in the database of user ${discorduser.username}`)
							collected.forEach(function(item, index) {
							foundmutes.addField(`Mute nr.${index +1} with description:`, `${item.description || nodesc}`)

						})

						var selectedmute = null

						message.channel.send(foundmutes)
						message.channel.send('Which ones of these would you like to remove?')
						message.channel.awaitMessages(awaitfiltertitle, {max:1, time:30000}).then(found =>{
						var integerr = parseInt(found.first().content)



						if (typeof integerr === 'number') {
							selectedmute = integerr
							message.channel.send(`You selected mute number ${integerr}`)
							collected[selectedmute - 1].destroy()
		
		
						}
						else return message.channel.send('Looks like the provided mute isn\'t a number or you didn\'t provide a number in time')	
			
					})

				}
					)
    
                    }
    
                    itemProcessed++;
                    if (itemProcessed === array.length) {
                        if(foundmatch == 'no') {
                            return message.channel.send(`The is no discord object created or you forgot to specify what game you want to mute on. See **m!help mute** for more info`) //Checks if discord isn't found
                        }
                        
                    }
    
                })   

            } else { //If it isn't a discord specific mute, search if there is a special case for a special game, otherwise execute the default

                 foundmatch = 'yes'
                          		
					var nodesc = 'No description given'
					muteobject.name = username

					const awaitfiltertitle = m=> m.author.id === message.author.id;
		
					Mutes.findAll({where: muteobject}).then(collected => {

						message.channel.send(`There were ${collected.length} entries found, which one of these do you want to remove?`)

						var foundmutes = new Discord.MessageEmbed()
						.setColor('#34b5db')
						.setTitle(`Mutes found in the database of user ${username}`)
						collected.forEach(function(item, index) {
						foundmutes.addField(`Mute nr.${index +1} with description:`, `${item.description || nodesc}`)

						})

					var selectedmute = null

					message.channel.send(foundmutes)
					message.channel.send('Which ones of these would you like to remove?')
					message.channel.awaitMessages(awaitfiltertitle, {max:1, time:30000}).then(found =>{
					var integerr = parseInt(found.first().content)



					if (typeof integerr === 'number') {
						selectedmute = integerr
						message.channel.send(`You selected mute number ${integerr}`)
						collected[selectedmute - 1].destroy()
	
		
					}
					else return message.channel.send('Looks like the provided mute isn\'t a number or you didn\'t provide a numer in time')	
			
					})

				}
				)
                
            }      
        })
	},
};