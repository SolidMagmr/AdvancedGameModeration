const Discord = require('discord.js');
var minimist = require('minimist');
const Warn = require('./Warn');

module.exports = {
	name: 'warns',
	description: 'Displays all the warns of a user that match the filters', 
	cooldown: 5, 
    guildOnly: true, 
    usage:'<username> with flags: -i <userID> -g <Game> -c <Cycle>',
	execute(message, args, Warns) { 

        if (!message.member.hasPermission("KICK_MEMBERS", false, true, false)) return message.channel.send("You do not have the required permissions");

        var username = args[0]

        var totalfilter = args.slice(1)
        var argv = minimist(totalfilter)

        console.log(argv)


        var filter = {
            name: username,
        }

        if(argv.i) {
            filter.userID = argv.i
        }
        if(argv.g) {
            filter.game = argv.g.toLowerCase()
        }
        if(argv.c) {
            filter.cycle = argv.c
        }

        Warns.findAll({where: filter}).then(collectedwarns => {
            var warnembed = new Discord.MessageEmbed()
            .setColor('#34b5db')
            .setTitle(`The warns of user ${username}`)
            .setDescription('Displays all of the warnings this user has received')
            collectedwarns.forEach(function(item, index){
                warnembed.addField(`**Warn nr.${index +1}**`, `On ${item.game} on cycle ${item.cycle} \n**warned by** ${item.warnedBy} \n**With description:** ${item.description} \n**And extra field of:** ${item.extra} \n**On date:** ${item.createdAt}` )
            
            
            })

            message.channel.send(warnembed)
        })

        
        

        console.log('=============================')
        console.log(filter)


	},
};