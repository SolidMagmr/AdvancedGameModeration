const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token } = require('./botconfig.json');
const Sequelize = require('sequelize');
const Warn = require('./commands/Warn');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	storage: 'database.sqlite'
});

const Warns = sequelize.define('warns', {
	name: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	userID: {
		type: Sequelize.INTEGER,
		allowNull: false,
	},
	game: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	cycle: {
		type: Sequelize.INTEGER,
		allowNull: false,
	},
	extra: {
		type: Sequelize.STRING,
		allowNull: true,
	},
	description: {
		type: Sequelize.STRING,
		allowNull: true,
	},
	warnedBy: {
		type: Sequelize.STRING,
		allowNull: true,
	},
	
});

const Mutes = sequelize.define('mutes', {
	name: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	userID: {
		type: Sequelize.INTEGER,
		allowNull: false,
	},
	game: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	cycle: {
		type: Sequelize.INTEGER,
		allowNull: false,
	},
	extra: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	description: {
		type: Sequelize.STRING,
		allowNull: true,
	},
	mutedBy: {
		type: Sequelize.STRING,
		allowNull: true,
	},
	muteDuration: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	
	
});

const Bans = sequelize.define('bans', {
	name: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	userID: {
		type: Sequelize.INTEGER,
		allowNull: false,
	},
	game: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	cycle: {
		type: Sequelize.INTEGER,
		allowNull: false,
	},
	extra: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	description: {
		type: Sequelize.STRING,
		allowNull: true,
	},
	warnedBy: {
		type: Sequelize.STRING,
		allowNull: true,
	},
	banDuration: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	
});


const cooldowns = new Discord.Collection();

client.once('ready', () => {
    console.log('Ready!');
	client.user.setActivity('For bad language', {type: "WATCHING"});
	Warns.sync()
	Bans.sync()
	Mutes.sync()
	
});

client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();

	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;

	if (command.guildOnly && message.channel.type !== 'text') {
		return message.reply('I can\'t execute that command inside DMs!');
	}

	if (command.args && !args.length) {
		let reply = `You didn't provide any arguments, ${message.author}!`;

		if (command.usage) {
			reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
		}

		return message.channel.send(reply);
	}

	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;

	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
		}
	}

	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

	try {
		command.execute(message, args, Warns, Mutes, Bans);
	} catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
});

client.login(token);