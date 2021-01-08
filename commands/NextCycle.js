const Discord = require('discord.js');
const fs = require('fs')
module.exports = {
	name: 'nextcycle',
	description: 'Starts a new cycle for the given table', 
	aliasses: ['nextround', 'nextseason', ], 
	cooldown: 3, 
    guildOnly: true, 
    usage:'<Name of the table>', 
	execute(message, args) {  

        var GameName = args[0].toLowerCase()

        fs.readFile('./gameinfo.json', 'UTF-8', function(err,data){
            if (err) throw err
            if (!message.member.hasPermission("KICK_MEMBERS", false, true, false)) return message.channel.send("You do not have the required permissions");

            var existing = JSON.parse(data)
            var foundmatch = false
            //console.log(existing.Games)
    
            existing.Games.forEach(function(element, index){


                if(element.tablename == GameName) {
                    foundmatch = true

                    if (element.useCycles == 'true'){

                        element.Cycle = element.Cycle + 1

                        fs.writeFile('./gameinfo.json', JSON.stringify(existing, null, '\t'), 'utf-8', function(err){
                            if(err) throw err
                           // console.log('Added the game to the table!')
                            message.channel.send(`The object ${GameName} has been set to cycle ${element.Cycle}`)
                           })

                    } else {
                        console.log(element.useCycles)
                        console.log('\nUse cyclesa was not enabled')
                    }

                     

                    }

            
            });
            if(foundmatch == false) return message.channel.send('That name wasn\'t found.')


        })
	},
};