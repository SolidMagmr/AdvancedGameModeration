const Discord = require('discord.js');
const fs = require('fs');
var minimist = require('minimist');
const yargs = require('yargs/yargs');

module.exports = {
	name: 'warn',
	description: 'Warns a user', 
	cooldown: 5, 
    guildOnly: true, 
    usage:'Basic form: <@discorduser> (This only works for discord but you **need** to have created a discord object with m!creategame) advanced form: <username> with flags -i <UserID> -g <game> -d <description> -e <extra field>',
	execute(message, args, Warns) {  
        
    if (!message.member.hasPermission("KICK_MEMBERS", false, true, false)) return message.channel.send("You do not have the required permissions");

    var username = args[0]
    if(!username) {return message.channel.send(`Atleast one argument must be provided`)}
    var totalfilter = args.slice(1).join(' ')
    var ByUser = message.author.username + '#' + message.author.discriminator
    var argv = yargs(totalfilter).argv

 

    var warnobject = {
        name: username,
        warnedBy: ByUser,

    }
    
    if(argv.i) {
        warnobject.userID = argv.i
    }
    if(argv.g) {
        warnobject.game = argv.g.toLowerCase()
    } 
    if(argv.e) {
        warnobject.extra = argv.e
    }
    if(argv.d) {
        warnobject.description = argv.d
    }

        

        fs.readFile('./gameinfo.json', 'UTF-8', function(err,data){
            if (err) throw err
            var existing = JSON.parse(data)

            var itemProcessed = 0;
            var foundmatch = 'no' // because booleans suck in my exerpeice I just use string, not efficient but please fix this if you want :)

            if(!argv.g) {  //The case where no game is provided and it automates to a discord warn, use the message.mentions.first() to get warndata

                existing.Games.forEach(function(element, index, array){
                    if(element.tablename == 'discord'){

                        console.log('Enterred the discord state')

                        foundmatch = 'yes'
                        if(!message.mentions.users.first()){return message.channel.send(`You forgot to mention a user or you didn't specify you want to warn someone on. See **m!help warn for more info**`)}
                        var discorduser = message.mentions.users.first()

                        warnobject.name = discorduser.username
                        warnobject.userID = discorduser.discriminator
                        warnobject.game = 'discord'
                        warnobject.extra = discorduser.id
                        warnobject.cycle = element.Cycle
                        
                        Warns.create(warnobject).then(function(){
                            discorduser.send(`You have been warned on the DJWK discord server for "${warnobject.description}" You can see your total warns in the discord server by typing !warns in the appropriate channel`)
                            return message.channel.send(`${username} has been succesfully warned by ${message.author.username}`)
                         }).catch(function(err){
                            console.log(err)
                            return message.channel.send('Oops, seems like I wasn\'t able to warn this person')
                        })
    
                    }
    
                    itemProcessed++;
                    if (itemProcessed === array.length) {
                        if(foundmatch == 'no') {
                            return message.channel.send(`The is no discord object created or you forgot to specify what game you want to warn on. See **m!help warn** for more info`) //Checks if discord isn't found
                        }
                        
                    }
    
                })   

            } else { //If it isn't a discord specific warn, search if there is a special case for a special game, otherwise execute the default

                existing.Games.forEach(function(element, index, array){
                    if(element.tablename == warnobject.game){
                        foundmatch = 'yes'
                        
                        switch (argv.g) { //Cases of special games
    
                            
    
    
                            
                            
                            default: //The warn system when there is no special case, user gives all arguments manually with no API functionality
                            
                             warnobject.cycle = element.Cycle
    
                                Warns.create(warnobject).then(function(){
                                return message.channel.send(`${username} has been succesfully warned by ${message.author.username}`)
                             }).catch(function(err){
                                console.log(err)
                                return message.channel.send('Oops, seems like I wasn\'t able to warn this person')
                            })
                        }
    
    
                    }
    
                    itemProcessed++;
                    if (itemProcessed === array.length) {
                        if(foundmatch == 'no') {
                            return message.channel.send(`The is no discord object created or you forgot to specify what game you want to warn on. See **m!help warn** for more info`) //Checks if discord isn't found
                        }
                    }
    
                }) 

            }

            

                  
        })
	},
};