const Discord = require('discord.js');
const fs = require('fs')
module.exports = {
	name: 'previouscycle',
	description: 'Rolls back the cycle by 1', 
	aliasses: ['previousround', 'previousseason', ], 
	cooldown: 3, 
    guildOnly: true, 
    usage:'<Name of the table>', 
	execute(message, args) {  

        var GameName = args[0].toLowerCase()

        fs.readFile('./gameinfo.json', 'UTF-8', function(err,data){
            if (err) throw err

            var existing = JSON.parse(data)
            var foundmatch = false
            //console.log(existing.Games)
    
            existing.Games.forEach(function(element, index){


                if(element.tablename == GameName) {
                    foundmatch = true

                    if (element.useCycles == 'true'){

                        if (element.Cycle == 1) return message.channel.send('This game is already on cycle 1')
                        element.Cycle = element.Cycle - 1

                        fs.writeFile('./gameinfo.json', JSON.stringify(existing, null, '\t'), 'utf-8', function(err){
                            if(err) throw err
                           // console.log('Added the game to the table!')
                            message.channel.send(`The object ${GameName} has been set back to cycle ${element.Cycle}`)
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