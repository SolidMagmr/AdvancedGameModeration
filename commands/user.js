const Discord = require('discord.js');

module.exports = {
	name: 'user',
	description: 'Gives a general overview of a discord user', //Description of the command
	aliasses: ['userinfo', 'profile'], //If you want people to be able to use other names for the command write them here
	cooldown: 5, //In seconds
    guildOnly: true, //Only able to be used in the discord server itself
    usage:'<Name argument here> <Another one here>', //If you want to set an correct usage of the command write them there, to keep everything conform put them between <>
	execute(message, args, Warns, Mutes, Bans) {  //Add code of the command here if you need 'Global' values, add them with a , seperated after the args and do the same in index.js
        const discordTag = message.mentions.users.first()
        if(!discordTag) return message.channel.send('Please tag the user you want to get the information of.')
        
        var searchedUser = message.mentions.users.first();
        var searchedMember = message.guild.member(searchedUser)
        //console.log(searchedMember.joinedTimestamp)
        
        function determineString (b){if(b){return 'Yes'} else {return 'no'}}
        function determineNickname(){if(searchedMember.nickname){return searchedMember.nickname} else {return 'This person has no nickname'}}

        Warns.findAll({where: {extra: discordTag.id}}).then(collectedwarns => {
            Mutes.findAll({where: {extra: discordTag.id}}).then(collectedmutes =>{
                Bans.findAll({where: {extra: discordTag.id}}).then(collectedbans =>{
                    var userembed = new Discord.MessageEmbed()
                    .setTitle(`Displaying the information of user ${discordTag.username + discordTag.discriminator}`)
                    .setThumbnail(searchedUser.avatarURL({dynamic:true}))
                    .setColor('#34b5db')
                    .addField('UserId', discordTag.id)
                    .addField('Nickname', determineNickname())
                    .addField('User age', ((Date.now() - searchedUser.createdAt) / (1000*60*60*24)).toFixed(1) + ' days', true)
                    .addField('Time in this server', ((Date.now() - searchedMember.joinedTimestamp) / (1000*60*60*24)).toFixed(1) + ' days', true)
                    .addField('\u200B', '\u200B', true)
                    .addField('Bannable', determineString(searchedUser.bannable), true)
                    .addField('Kickable', determineString(searchedUser.kickable), true)
                    .addField('\u200B', '\u200B', true)
                    .addField('Roles', searchedMember.roles.cache.map(r => r.name).join(", ")) 
                    //.setThumbnail(discordTag.avatar)    Fix this so it displays the user's avatar
                    //console.log(collectedwarns)
                    .addFields(
                        { name: 'Warns', value: collectedwarns.length, inline: true },
                        { name: 'Mutes', value: collectedmutes.length, inline: true },
                        { name: 'Bans', value: collectedbans.length, inline: true },
                    )
                   
                    message.channel.send(userembed)
                })
            })
        })
        
        
        //console.log(discordTag)
	},
};