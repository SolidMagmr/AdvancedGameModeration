const Discord = require('discord.js');
const fs = require('fs');

module.exports = {
	name: 'delban',
	description: 'Deletes a ban from the database', 
	aliasses: ['deleteban', 'removeban', 'destroyban', 'unban'], 
	cooldown: 5, 
    guildOnly: true, 
    usage:'<Username> or <Tag discord user>', 
	execute(message, args, Warns, Mutes, Bans) {  

	if (!message.member.hasPermission("KICK_MEMBERS", false, true, false)) return message.channel.send("You do not have the required permissions");

    var username = args[0]
    if(!username) {return message.channel.send(`Atleast one argument must be provided`)}
    var totalfilter = args.slice(1).join(' ')

 

    var banobject = {

    }
    
        
        fs.readFile('./gameinfo.json', 'UTF-8', function(err,data){
            if (err) throw err
            var existing = JSON.parse(data)

            var itemProcessed = 0;
            var foundmatch = 'no' // because booleans suck in my expperience I just use string, not efficient but please fix this if you want :)

            if(message.mentions.users.first()) {  //The case where no game is provided and it automates to a discord ban, use the message.mentions.first() to get bandata

                existing.Games.forEach(function(element, index, array){
                    if(element.tablename == 'discord'){

						var discorduser = message.mentions.users.first()
						var nodesc = 'No description given'
						banobject.extra = discorduser.id
						foundmatch = 'yes'

						const awaitfiltertitle = m=> m.author.id === message.author.id;
		
						Bans.findAll({where: banobject}).then(collected => {

							message.channel.send(`There were ${collected.length} entries found, which one of these do you want to remove?`)

							var foundbans = new Discord.MessageEmbed()
							.setColor('#34b5db')
							.setTitle(`Bans found in the database of user ${discorduser.username}`)
							collected.forEach(function(item, index) {
							foundbans.addField(`Ban nr.${index +1} with description:`, `${item.description || nodesc}`)

						})

						var selectedban = null

						message.channel.send(foundbans)
						message.channel.send('Which ones of these would you like to remove?')
						message.channel.awaitMessages(awaitfiltertitle, {max:1, time:30000}).then(found =>{
						var integerr = parseInt(found.first().content)



						if (typeof integerr === 'number') {
							selectedban = integerr
							message.channel.send(`You selected ban number ${integerr}`)
							collected[selectedban - 1].destroy()
		
		
						}
						else return message.channel.send('Looks like the provided ban isn\'t a number or you didn\'t provide a numer in time')	
			
					})

				}
					)
    
                    }
    
                    itemProcessed++;
                    if (itemProcessed === array.length) {
                        if(foundmatch == 'no') {
                            return message.channel.send(`The is no discord object created or you forgot to specify what game you want to ban on. See **m!help ban** for more info`) //Checks if discord isn't found
                        }
                        
                    }
    
                })   

            } else { //If it isn't a discord specific ban, search if there is a special case for a special game, otherwise execute the default

                 foundmatch = 'yes'
                          		
					var nodesc = 'No description given'
					banobject.name = username

					const awaitfiltertitle = m=> m.author.id === message.author.id;
		
					Bans.findAll({where: banobject}).then(collected => {

						message.channel.send(`There were ${collected.length} entries found, which one of these do you want to remove?`)

						var foundbans = new Discord.MessageEmbed()
						.setColor('#34b5db')
						.setTitle(`bans found in the database of user ${username}`)
						collected.forEach(function(item, index) {
						foundbans.addField(`Ban nr.${index +1} with description:`, `${item.description || nodesc}`)

						})

					var selectedban = null

					message.channel.send(foundbans)
					message.channel.send('Which ones of these would you like to remove?')
					message.channel.awaitMessages(awaitfiltertitle, {max:1, time:30000}).then(found =>{
					var integerr = parseInt(found.first().content)



					if (typeof integerr === 'number') {
						selectedban = integerr
						message.channel.send(`You selected ban number ${integerr}`)
						collected[selectedban - 1].destroy()
	
		
					}
					else return message.channel.send('Looks like the provided ban isn\'t a number or you didn\'t provide a numer in time')	
			
					})

				}
				)
                
            }      
        })
	},
};