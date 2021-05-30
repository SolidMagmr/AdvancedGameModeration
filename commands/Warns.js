const Discord = require('discord.js');
var minimist = require('minimist');
const fs = require('fs');
const yargs = require('yargs/yargs');

module.exports = {
	name: 'warns',
	description: 'Displays all the warns of a user that match the filters', 
	cooldown: 5, 
    guildOnly: true, 
    usage:'Basic form: <@discorduser> (This only works for discord but you **need** to have created a discord object with m!creategame) advanced form: <username> with flags -i <UserID> -g <game> -d <description> -e <extra field> -c <cycle>',
	execute(message, args, Warns) { 


    
    var totalfilter = args.join(' ')
    var argv = yargs(totalfilter).argv

    if(totalfilter && !message.member.hasPermission("KICK_MEMBERS", false, true, false)) {return message.channel.send(`You do not have the permissions to view someone else\'s warns`)}

    var warnobject = {

    }
    

    if(!totalfilter){
        warnobject.extra = message.author.id
        warnobject.game = 'discord'
        warnobject.name = message.author.username
    }

    if(argv.i) {
        warnobject.userID = argv.i
    }
    if(argv.g) {
        warnobject.game = argv.g.toLowerCase()
    }
    if(argv.c) {
        warnobject.cycle = argv.c
    }
    if (argv.n) {
        warnobject.name = argv.n
    }
    if(argv.d) {
        warnobject.description = argv.d
    }
    if(argv.e) {
        warnobject.extra = argv.e
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

                        warnobject.name = discorduser.username
                        warnobject.userID = discorduser.discriminator
                        warnobject.game = 'discord'
                        warnobject.extra = discorduser.id
                        
                        Warns.findAll({where: warnobject}).then(collectedwarns => {
                            var warnembed = new Discord.MessageEmbed()
                            .setColor('#34b5db')
                            .setTitle(`The warns of user ${discorduser.username}`)
                            .setDescription('Displays all of the warnings this user has received')
                            collectedwarns.forEach(function(item, index){
                                warnembed.addField(`**Warn nr.${index +1}**`, `On ${item.game} on cycle ${item.cycle} \n**warned by** ${item.warnedBy} \n**With description:** ${item.description} \n**And extra field of:** ${item.extra} \n**On date:** ${item.createdAt}` )
                            
                            
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
    
             Warns.findAll({where: warnobject}).then(collectedwarns => {

             var warnembed = new Discord.MessageEmbed()
                .setColor('#34b5db')
                .setTitle(`The warns of user ${warnobject.name || warnobject.userID}`)
                .setDescription('Displays all of the warnings this user has received')
                collectedwarns.forEach(function(item, index){
                     warnembed.addField(`**Warn nr.${index +1}**`, `On ${item.game} on cycle ${item.cycle} \n**warned by** ${item.warnedBy} \n**With description:** ${item.description} \n**And extra field of:** ${item.extra} \n**On date:** ${item.createdAt}` )
                                
                                
                         })
                    
                           message.channel.send(warnembed)
                     })
                 
                

            }

            

                  
        })
	},
};