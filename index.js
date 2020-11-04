const Discord = require('discord.js')
const chalk = require('chalk')
const client = new Discord.Client();
const config = require("./config.json")
let prefix = config.prefix;
let ownerOnly = config.ownerOnly

client.login(process.env.TOKEN)


client.on('ready', () => {
    console.log(chalk.greenBright(`LOGGED IN AS ${client.user.tag}`))
    console.log(chalk.greenBright('MASS DM BOT 2020/2021'))
    console.log(chalk.greenBright(`COMMAND = ${prefix}dmall`))
    console.log(chalk.greenBright('MADE BY @chrome#5555'))
})

client.on('message', async message => {
    const guild = message.guild;
    const args = message.content.slice(prefix.length).trim().split(' ').slice(1).join(' ');


    if (message.content.startsWith(prefix + "dmall")) {
    if (ownerOnly === true && message.author.id !== config.ownerID) return;
        else
        message.delete();
        
        await guild.members.fetch();
        var memberCount = guild.members.cache.filter(member => !member.user.bot).size;
        console.log(chalk.yellow.bold.underline(`DMING ALL ${memberCount} USERS OF ${guild.name}`))
        await Promise.all(guild.members.cache.map(async (member) => {


            if (!member.user.bot) {
                member.send(`${args}\n ${member}`).then(sent => {
                        console.log(chalk.greenBright(`MESSAGE SENT TOO ${member.user.tag}`))
                    })

                    .catch(err => {
                        console.log(chalk.redBright(`ERROR | COULDNT DM ${member.user.tag}`));
                    })

            }
        }))
    }
})
