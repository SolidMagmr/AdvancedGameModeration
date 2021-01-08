const Discord = require('discord.js');
const fs = require('fs')
module.exports = {
	name: 'removegame',
	description: 'Removes the aviability of the game from the system but keeps all the warns,mutes and bans', 
	aliasses: ['removetable', 'deletetable', 'deletegame',], 
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
            var didConfirm = 'No'
            //console.log(existing.Games)
    
            existing.Games.forEach(function(element, index){

                const filter = m => m.content == 'Confirmed' && m.author.id === message.author.id

                if(element.tablename == GameName) {
                    foundmatch = true
                    message.channel.send(`Are you sure you want to delete the table **${GameName}** type **Confirmed** in the next 10 seconds to confirm the removal`)
                    message.channel.awaitMessages(filter, {max:1, time:10000}).then(
                     collected => didConfirm = collected.first().content).then(afterconfirm)


                    function afterconfirm () {
                        existing.Games.splice(index, 1)

                        fs.writeFile('./gameinfo.json', JSON.stringify(existing, null, '\t'), 'utf-8', function(err){
                            if(err) throw err
                           // console.log('Added the game to the table!')
                            message.channel.send(`The object ${GameName} has been removed from the system, the database remains intact`)
                        })

                    }

            
            }});
            if(foundmatch == false) return message.channel.send('That name wasn\'t found.')


        })
	},
};