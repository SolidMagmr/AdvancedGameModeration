const Discord = require('discord.js');
const fs = require('fs')

module.exports = {
	name: 'warn',
	description: 'Warns a user', //Description of the command
	cooldown: 5, //In seconds
    guildOnly: true, //Only able to be used in the discord server itself
    usage:'<Username (Do **not** use the @ tag in discord)> <UserID or the discord tag> <Game> <desc> <use a flag -e at the end to add an extra field of information.>', //If you want to set an correct usage of the command write them there, to keep everything conform put them between <>
	execute(message, args, Warns) {  //Add code of the command here if you need 'Global' values, add them with a , seperated after the args and do the same in index.js
        var username = args[0]
        var userIDD = args[1]
        var gamee = args[2].toLowerCase()
        var descsplit = args.slice(3).join(' ')
        var extrasplit = descsplit.split('-e')
        var desc = extrasplit[0]
        var extraa = extrasplit[1]
        var ByUser = message.author.username + '#' + message.author.discriminator

        var setcycle = 1
        var foundmatch = 'no'

        if (!message.member.hasPermission("KICK_MEMBERS", false, true, false)) return message.channel.send("You do not have the required permissions");

        fs.readFile('./gameinfo.json', 'UTF-8', function(err,data){
            if (err) throw err
            var existing = JSON.parse(data)

            existing.Games.forEach(function(element, index){

                if(element.tablename == gamee){
                    foundmatch = 'yes'
                    setcycle = element.Cycle
                    //console.log(`The element cycle is ${element.Cycle}`)
                   // console.log('Found a match')

                    //console.log(foundmatch)
                    if (foundmatch == 'no') return message.channel.send('The game provided wasn\'t found')
                    Warns.create({
                        name: username,
                        userID: userIDD,
                        game: gamee,
                        cycle: setcycle,
                        extra: extraa,
                        description: desc,
                        warnedBy: ByUser
            
                    }).then(function(){
                        //console.log("Succesfull warn")
                        return message.channel.send(`${username} has been succesfully warned by ${message.author.username}`)
                    }).catch(function(err){
                        console.log(err)
                        return message.channel.send('Oops, seems like I wasn\'t able to warn this person')
                    })

                }

            })
        })


        //paste it here
       
	},
};