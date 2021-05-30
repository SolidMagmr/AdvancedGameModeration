const Discord = require('discord.js');
var minimist = require('minimist');
const fs = require('fs');
const yargs = require('yargs/yargs');

module.exports = {
	name: 'bans',
	description: 'Displays all the bans of a user that match the filters', 
	cooldown: 5, 
    guildOnly: true, 
    usage:'Basic form: <@discorduser> (This only works for discord but you **need** to have created a discord object with m!creategame) advanced form: <username> with flags -n <name> -i <UserID> -g <game> -d <description> -e <extra field> -c <cycle>',
	execute(message, args, Warns, Mutes, Bans) { 

     var totalfilter = args.join(' ')
     if(totalfilter && !message.member.hasPermission("KICK_MEMBERS", false, true, false)) {return message.channel.send(`You do not have the permissions to view someone else\'s warns`)}
     var argv = yargs(totalfilter).argv

 

    var banobject = {

    }

    if(!totalfilter){
        banobject.extra = message.author.id
        banobject.game = 'discord'
        banobject.name = message.author.username
    }
    
    
    if(argv.i) {
        banobject.userID = argv.i
    }
    if(argv.g) {
        banobject.game = argv.g.toLowerCase()
    }
    if(argv.c) {
        banobject.cycle = argv.c
    }
    if (argv.n) {
        banobject.name = argv.n
    }
    if(argv.d) {
        banobject.description = argv.d
    }
    if(argv.e) {
        banobject.extra = argv.e
    }

        

        fs.readFile('./gameinfo.json', 'UTF-8', function(err,data){
            if (err) throw err
            var existing = JSON.parse(data)

            var itemProcessed = 0;
            var foundmatch = 'no' // because booleans suck in my exerpeice I just use string, not efficient but please fix this if you want :)

            if(message.mentions.users.first()) {  //The case where no game is provided and it automates to a discord warn, use the message.mentions.first() to get warndata

                existing.Games.forEach(function(element, index, array){
                    if(element.tablename == 'discord'){

                        //console.log('Enterred the discord state')

                        foundmatch = 'yes'
                        var discorduser = message.mentions.users.first()

                        banobject.name = discorduser.username
                        banobject.userID = discorduser.discriminator
                        banobject.game = 'discord'
                        banobject.extra = discorduser.id

                        
                        Bans.findAll({where: banobject}).then(collectedbans => {
                            var warnembed = new Discord.MessageEmbed()
                            .setColor('#34b5db')
                            .setTitle(`The bans of user ${discorduser.username}`)
                            .setDescription('Displays all of the bans this user has received')
                            collectedbans.forEach(function(item, index){
                                warnembed.addField(`**Ban nr.${index +1}**`, `On ${item.game} on cycle ${item.cycle} for ${item.banDuration}\n**Banned by** ${item.bannedBy} \n**With description:** ${item.description} \n**And extra field of:** ${item.extra} \n**On date:** ${item.createdAt}` )
                            
                            
                            })
                
                            message.channel.send(warnembed)
                        })
                    }
    
                    itemProcessed++;
                    if (itemProcessed === array.length) {
                        if(foundmatch == 'no') {
                            return message.channel.send(`The is no discord object created so you cannot see discord warn fo a user, don't tag a user to see other warns.`) //Checks if discord isn't found
                        }
                        
                    }
    
                })   

            } else { //If it isn't a discord specific warn, search if there is a special case for a special game, otherwise execute the default
      
             //console.log('Enterred the non discord state')
    
             Bans.findAll({where: banobject}).then(collectedbans => {
             var warnembed = new Discord.MessageEmbed()
                .setColor('#34b5db')
                .setTitle(`The bans of user ${banobject.name || banobject.userID}`)
                .setDescription('Displays all of the bans this user has received')
                collectedbans.forEach(function(item, index){
                     warnembed.addField(`**Ban nr.${index +1}**`, `On ${item.game} on cycle ${item.cycle} for ${item.banDuration}\n**banned by** ${item.bannedBy} \n**With description:** ${item.description} \n**And extra field of:** ${item.extra} \n**On date:** ${item.createdAt}` )
                     warnembed.setTitle(`The bans of user ${item.name}`)   
                                
                         })
                    
                           message.channel.send(warnembed)
                     })
                 
                

            }

            

                  
        })
	},
};