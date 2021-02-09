const Discord = require('discord.js');
const fs = require('fs');
var minimist = require('minimist');
const yargs = require('yargs/yargs');

module.exports = {
	name: 'ban',
	description: 'Bans a user', 
    cooldown: 5, 
    aliasses: ['banish', 'expel'],
    guildOnly: true, 
    usage:'Basic form: <@discorduser> (This only works for discord but you **need** to have created a discord object with m!creategame) advanced form: <username> with flags -i <UserID> -g <game> -d <description> -e <extra field> -t <Time>',
	execute(message, args, Warns, Mutes, Bans) {  
        
    if (!message.member.hasPermission("KICK_MEMBERS", false, true, false)) return message.channel.send("You do not have the required permissions");

    var username = args[0]
    if(!username) {return message.channel.send(`Atleast one argument must be provided`)}
    var totalfilter = args.slice(1).join(' ')
    var ByUser = message.author.username + '#' + message.author.discriminator
    var argv = yargs(totalfilter).argv

 

    var banobject = {
        name: username,
        bannedBy: ByUser,

    }
    
    if(argv.i) {
        banobject.userID = argv.i
    }
    if(argv.g) {
        banobject.game = argv.g.toLowerCase()
    } 
    if(argv.e) {
        banobject.extra = argv.e
    }
    if(argv.d) {
        banobject.description = argv.d
    }
    if(argv.t) {
        banobject.banDuration = argv.t
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
            var foundmatch = 'no' // because booleans suck in my experience I just use string, not efficient but please fix this if you want :)

            if(!argv.g) {  //The case where no game is provided and it automates to a discord ban, use the message.mentions.first() to get bandata

                existing.Games.forEach(function(element, index, array){
                    if(element.tablename == 'discord'){


                        foundmatch = 'yes'
                        if(!message.mentions.users.first()){return message.channel.send(`You forgot to mention a user or you didn't specify where you want to ban someone on. See **m!help ban for more info**`)}
                        var discorduser = message.mentions.users.first()
                        var discordmember = message.guild.members.cache.find(m => m == discorduser.id)
                        //console.log(guildMember)

                        if(!argv.t) banobject.banDuration = 'permanent'

                        banobject.name = discorduser.username
                        banobject.userID = discorduser.discriminator
                        banobject.game = 'discord'
                        banobject.extra = discorduser.id
                        banobject.cycle = element.Cycle


                        function Bancommand(){


                            if(argv.t){ //When a timer is set, warn somebody for a specific time
                                try{
                                    discordmember.ban({reason: banobject.description})
                                }
                                catch(err){
                                    message.channel.send('Could not ban this person, do I have the required permissions? Note: I save the ban to the databse just in case, remove it with m!delban')
                                    throw err; 
                                }

                                var unbantimer = 1000

                                switch (indicator) { //Creates the time when to unban someone
                                    case 's':
                                        unbantimer = time * 1000
                                        //console.log('Second mode')
                                        break
                                    case 'm':
                                        unbantimer = time * 1000 * 60
                                        //console.log('Minute mode')
                                        break
                                    case 'h':
                                        unbantimer = time * 1000 * 60 * 60.
                                        break
                                    case 'd':
                                        unbantimer = time * 1000 * 60 * 60 * 24
                                        break
                                    case 'w':
                                        unbantimer = time * 1000 * 60 *60 * 24 * 7
                                        break

                                }

                                setTimeout(function(){
                                    try{
                                        message.guild.members.unban(discorduser.id)
                                    }
                                    catch(err){
                                        throw err; 
                                    }
                                }, unbantimer)

                            } else {
                                try{
                                    discordmember.ban({reason: banobject.description})
                                }
                                catch(err){
                                    message.channel.send('Could not ban this person, do I have the required permissions? Note: I save the ban to the databse just in case, remove it with m!delban')
                                    throw err; 
                                }
                            }
                            
                        }
                        
                        Bans.create(banobject).then(function(){
                            Bancommand()
                            return message.channel.send(`${username} has been succesfully banned by ${message.author.username}`)
                         }).catch(function(err){
                            console.log(err)
                            return message.channel.send('Oops, seems like I wasn\'t able to ban this person')
                        })
    
                    }
    
                    itemProcessed++;
                    if (itemProcessed === array.length) {
                        if(foundmatch == 'no') {
                            return message.channel.send(`The is no discord object created or you forgot to specify what game you want to ban on. See **m!help ban** for more info`) //Checks if discord isn't found
                        }
                        
                    }
    
                })   

            } else { //If it isn't a discord specific ban, search if there is a special case for a special game, otherwise execute the default

                existing.Games.forEach(function(element, index, array){
                    if(element.tablename == banobject.game){
                        foundmatch = 'yes'
                        
                        switch (argv.g) { //Cases of special games
    
                            
    
    
                            
                            
                            default: //The ban system when there is no special case, user gives all arguments manually with no API functionality
                            
                             banobject.cycle = element.Cycle
    
                                Bans.create(banobject).then(function(){
                                return message.channel.send(`${username} has been succesfully banned by ${message.author.username}`)
                             }).catch(function(err){
                                console.log(err)
                                return message.channel.send('Oops, seems like I wasn\'t able to ban this person')
                            })
                        }
    
    
                    }
    
                    itemProcessed++;
                    if (itemProcessed === array.length) {
                        if(foundmatch == 'no') {
                            return message.channel.send(`The is no discord object created or you forgot to specify what game you want to ban on. See **m!help ban** for more info`) //Checks if discord isn't found
                        }
                    }
    
                }) 

            }

            

                  
        })
	},
};