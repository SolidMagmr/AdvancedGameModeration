const Discord = require('discord.js');
var minimist = require('minimist');
const fs = require('fs');
const yargs = require('yargs/yargs');

module.exports = {
	name: 'mutes',
	description: 'Displays all the mutes of a user that match the filters', 
	cooldown: 5, 
    guildOnly: true, 
    usage:'Basic form: <@discorduser> (This only works for discord but you **need** to have created a discord object with m!creategame) advanced form: <username> with flags -n <name> -i <UserID> -g <game> -d <description> -e <extra field> -c <cycle>',
	execute(message, args, Warns, Mutes) { 

        if (!message.member.hasPermission("KICK_MEMBERS", false, true, false)) return message.channel.send("You do not have the required permissions");

    
    var totalfilter = args.join(' ')
    if(!totalfilter) {return message.channel.send(`Atleast one argument must be provided`)}
    var argv = yargs(totalfilter).argv

 

    var muteobject = {

    }
    
    if(argv.i) {
        muteobject.userID = argv.i
    }
    if(argv.g) {
        muteobject.game = argv.g.toLowerCase()
    }
    if(argv.c) {
        muteobject.cycle = argv.c
    }
    if (argv.n) {
        muteobject.name = argv.n
    }
    if(argv.d) {
        muteobject.description = argv.d
    }
    if(argv.e) {
        muteobject.extra = argv.e
    }

        

        fs.readFile('./gameinfo.json', 'UTF-8', function(err,data){
            if (err) throw err
            var existing = JSON.parse(data)

            var itemProcessed = 0;
            var foundmatch = 'no' // because booleans suck in my exerpeice I just use string, not efficient but please fix this if you want :)

            if(message.mentions.users.first()) {  //The case where no game is provided and it automates to a discord mute, use the message.mentions.first() to get mutedata

                existing.Games.forEach(function(element, index, array){
                    if(element.tablename == 'discord'){

                        //console.log('Enterred the discord state')

                        foundmatch = 'yes'
                        var discorduser = message.mentions.users.first()

                        muteobject.name = discorduser.username
                        muteobject.userID = discorduser.discriminator
                        muteobject.game = 'discord'
                        muteobject.extra = discorduser.id

                        
                        Mutes.findAll({where: muteobject}).then(collectedmutes => {
                            var muteembed = new Discord.MessageEmbed()
                            .setColor('#34b5db')
                            .setTitle(`The mutes of user ${discorduser.username}`)
                            .setDescription('Displays all of the mutes this user has received')
                            collectedmutes.forEach(function(item, index){
                                muteembed.addField(`**Mute nr.${index +1}**`, `On ${item.game} on cycle ${item.cycle} for ${item.muteDuration}\n**Muted by** ${item.mutedBy} \n**With description:** ${item.description} \n**And extra field of:** ${item.extra} \n**On date:** ${item.createdAt}` )
                            
                            
                            })
                
                            message.channel.send(muteembed)
                        })
                    }
    
                    itemProcessed++;
                    if (itemProcessed === array.length) {
                        if(foundmatch == 'no') {
                            return message.channel.send(`The is no discord object created so you cannot see discord mute fo a user, don't tag a user to see other mutes.`) //Checks if discord isn't found
                        }
                        
                    }
    
                })   

            } else { //If it isn't a discord specific mute, search if there is a special case for a special game, otherwise execute the default
      
             //console.log('Enterred the non discord state')
    
             Mutes.findAll({where: muteobject}).then(collectedmutes => {
             var muteembed = new Discord.MessageEmbed()
                .setColor('#34b5db')
                
                .setDescription('Displays all of the mutes this user has received')
                collectedmutes.forEach(function(item, index){
                     muteembed.addField(`**Mute nr.${index +1}**`, `On ${item.game} on cycle ${item.cycle} for ${item.muteDuration}\n**muted by** ${item.mutedBy} \n**With description:** ${item.description} \n**And extra field of:** ${item.extra} \n**On date:** ${item.createdAt}` )
                     muteembed.setTitle(`The mutes of user ${item.name}`)   
                                
                         })
                    
                           message.channel.send(muteembed)
                     })
                 
                

            }

            

                  
        })
	},
};