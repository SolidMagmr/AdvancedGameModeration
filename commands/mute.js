const Discord = require('discord.js');
const fs = require('fs');
var minimist = require('minimist');
const yargs = require('yargs/yargs');

module.exports = {
	name: 'mute',
	description: 'Mutes a user', 
    cooldown: 5, 
    aliasses: ['Silence'],
    guildOnly: true, 
    usage:'Basic form: <@discorduser> (This only works for discord but you **need** to have created a discord object with m!creategame) advanced form: <username> with flags -i <UserID> -g <game> -d <description> -e <extra field> -t <Time>',
	execute(message, args, Warns, Mutes, Bans) {  
        
    if (!message.member.hasPermission("KICK_MEMBERS", false, true, false)) return message.channel.send("You do not have the required permissions");

    var username = args[0]
    if(!username) {return message.channel.send(`Atleast one argument must be provided`)}
    var totalfilter = args.slice(1).join(' ')
    var ByUser = message.author.username + '#' + message.author.discriminator
    var argv = yargs(totalfilter).argv

 

    var muteobject = {
        name: username,
        mutedBy: ByUser,

    }
    
    if(argv.i) {
        muteobject.userID = argv.i
    }
    if(argv.g) {
        muteobject.game = argv.g.toLowerCase()
    } 
    if(argv.e) {
        muteobject.extra = argv.e
    }
    if(argv.d) {
        muteobject.description = argv.d
    }
    if(argv.t) {
        muteobject.muteDuration = argv.t
        try{
        var regsplit = /[smhdw]\B/;
        var splitPlace = argv.t.search(regsplit)
        var indicator = argv.t.slice(splitPlace).toString()
        var time = parseInt(argv.t.slice(0, splitPlace))
        }
        catch(err){
            message.channel.send('Couldn\'t parse the time, did you use the correct timeindicators? ex. 2d, 1m, 3w, 30s')
            throw err
        }
    }

    

        

        fs.readFile('./gameinfo.json', 'UTF-8', function(err,data){
            if (err) throw err
            var existing = JSON.parse(data)

            var itemProcessed = 0;
            var foundmatch = 'no' // because booleans suck in my exerpeice I just use string, not efficient but please fix this if you want :)

            if(!argv.g) {  //The case where no game is provided and it automates to a discord mute, use the message.mentions.first() to get mutedata

                existing.Games.forEach(function(element, index, array){
                    if(element.tablename == 'discord'){


                        foundmatch = 'yes'
                        if(!message.mentions.users.first()){return message.channel.send(`You forgot to mention a user or you didn't specify where you want to mute someone on. See **m!help mute for more info**`)}
                        var discorduser = message.mentions.users.first()
                        var discordmember = message.guild.members.cache.find(m => m == discorduser.id)
                        //console.log(discordmember)

                        if(!argv.t) muteobject.muteDuration = 'permanent'

                        muteobject.name = discorduser.username
                        muteobject.userID = discorduser.discriminator
                        muteobject.game = 'discord'
                        muteobject.extra = discorduser.id
                        muteobject.cycle = element.Cycle


                        function Mutecommand(){
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
                            if(argv.t){ //When a timer is set, warn somebody for a specific time
                                try{
                                    discordmember.roles.add(muteRole)
                                }
                                catch(err){
                                    message.channel.send('Could not mute this person, do I have the required permissions? Note: I save the mute to the databse just in case, remove it with m!delmute')
                                    throw err; 
                                }

                                var unmutetimer = 1000

                                switch (indicator) { //Creates the time when to unmute someone
                                    case 's':
                                        unmutetimer = time * 1000
                                        //console.log('Second mode')
                                        break
                                    case 'm':
                                        unmutetimer = time * 1000 * 60
                                        //console.log('Minute mode')
                                        break
                                    case 'h':
                                        unmutetimer = time * 1000 * 60 * 60.
                                        break
                                    case 'd':
                                        unmutetimer = time * 1000 * 60 * 60 * 24
                                        break
                                    case 'w':
                                        unmutetimer = time * 1000 * 60 *60 * 24 * 7
                                        break

                                }

                                setTimeout(function(){
                                    try{
                                        //console.log('Reached remove function')
                                        discordmember.roles.remove(muteRole)
                                    }
                                    catch(err){
                                        throw err; 
                                    }
                                }, unmutetimer)

                            } else {
                                try{
                                    discordmember.roles.add(muteRole)
                                }
                                catch(err){
                                    message.channel.send('Could not mute this person, do I have the required permissions? Note: I save the mute to the databse just in case, remove it with m!delmute')
                                    throw err; 
                                }
                            }
                            
                        }
                        
                        Mutes.create(muteobject).then(function(){
                            Mutecommand()
                            return message.channel.send(`${username} has been succesfully muted by ${message.author.username}`)
                         }).catch(function(err){
                            console.log(err)
                            return message.channel.send('Oops, seems like I wasn\'t able to mute this person')
                        })
    
                    }
    
                    itemProcessed++;
                    if (itemProcessed === array.length) {
                        if(foundmatch == 'no') {
                            return message.channel.send(`The is no discord object created or you forgot to specify what game you want to mute on. See **m!help mute** for more info`) //Checks if discord isn't found
                        }
                        
                    }
    
                })   

            } else { //If it isn't a discord specific mute, search if there is a special case for a special game, otherwise execute the default

                existing.Games.forEach(function(element, index, array){
                    if(element.tablename == muteobject.game){
                        foundmatch = 'yes'
                        
                        switch (argv.g) { //Cases of special games
    
                            
    
    
                            
                            
                            default: //The mute system when there is no special case, user gives all arguments manually with no API functionality
                            
                             muteobject.cycle = element.Cycle
    
                                Mutes.create(muteobject).then(function(){
                                return message.channel.send(`${username} has been succesfully muted by ${message.author.username}`)
                             }).catch(function(err){
                                console.log(err)
                                return message.channel.send('Oops, seems like I wasn\'t able to mute this person')
                            })
                        }
    
    
                    }
    
                    itemProcessed++;
                    if (itemProcessed === array.length) {
                        if(foundmatch == 'no') {
                            return message.channel.send(`The is no discord object created or you forgot to specify what game you want to mute on. See **m!help mute** for more info`) //Checks if discord isn't found
                        }
                    }
    
                }) 

            }

            

                  
        })
	},
};