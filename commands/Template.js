const Discord = require('discord.js');

module.exports = {
	name: 'NameHere',
	description: 'Template what to fill in', //Description of the command
	aliasses: ['Test', 'DevHelp',], //If you want people to be able to use other names for the command write them here
	cooldown: 5, //In seconds
    guildOnly: true, //Only able to be used in the discord server itself
    usage:'<Name argument here> <Another one here>', //If you want to set an correct usage of the command write them there, to keep everything conform put them between <>
	execute(message, args) {  //Add code of the command here if you need 'Global' values, add them with a , seperated after the args and do the same in index.js
		console.log(message + args)
	},
};