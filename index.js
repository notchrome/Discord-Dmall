const axios = require("axios")

const rax = require('retry-axios')

const Discord = require("discord.js")

const chalk = require("chalk")

var inquirer = require('inquirer');

const config = require("./config.json")

const interceptorId = rax.attach();

let token = config.token;

//let guildid = "744473542220972123"

let guild = config.guildid;

var guildid = [];

var userids = [];

var channels = [];



let message = config.dmMessage;




async function getguilds() {

	await axios(`https://discord.com/api/v8/users/@me/guilds`, {

			method: 'GET',

			headers: {

				"Authorization": 'Bot ' + token,

				"Content-Type": "application/json",

			},

		})

		.then(resp => {

			console.log(resp.data)

			resp.data.map(g => {

				console.log(chalk.yellowBright(g.name))

				guildid.push(g.id)

			})

		})

}



async function fetch(after) {

	const fetch = await axios(`https://discord.com/api/v8/guilds/${guildid}/members?limit=1000&${after ? "after=" + after : ""}`, {

		method: 'GET',

		headers: {

			"Authorization": 'Bot ' + token,

			"Content-Type": "application/json",

		},

	});

	return await fetch.data;

}

async function scrapeu() {

	let chan = await fetch();

	await chan.map(u => {

		userids.push(u.user.id)

	})

	while (chan.length >= 1000) {

		console.log("hi")

		chan = await fetch(chan[chan.length - 1].user.id);

		await chan.map(u => {

			userids.push(u.user.id)

		})

	}

}



async function scrapeuuall(guild) {



	userids = [];



	await new Promise((resolve, reject) => {



		const client = new Discord.Client();

		client.login(token)



		client.on('ready', async () => {

			//	console.log("hi")

			const guildd = client.guilds.get(guild)

			await guildd.fetchMembers();

			await Promise.all(guildd.members.map(async (member) => {

				if (member.user.bot == false) {

					userids.push(member.id);

					//   console.log(member.id)

				}

			})).then(resolve())



			await client.destroy(token)



		})



	})

}

async function scrapeuuonline(guild) {



	userids = [];



	await new Promise((resolve, reject) => {



		const client = new Discord.Client();

		client.login(token)



		client.on('ready', async () => {

			console.log("hi")

			const guildd = client.guilds.get(guild)

			await guildd.fetchMembers();

			await Promise.all(guildd.members.map(async (member) => {

				if (member.presence.status !== "offline" && member.user.bot == false) {

					userids.push(member.id);

					//   console.log(member.id)

				}

			})).then(resolve())



			await client.destroy(token)



		})



	})

}

async function scrapeonline(guildid) {



	userids = [];



	await new Promise((resolve, reject) => {



		const client = new Discord.Client();

		client.login(token)



		client.on('ready', async () => {

			console.log("hi")

			const guild = client.guilds.get(guildid)

			await guild.fetchMembers();

			await Promise.all(guild.members.map(async (member) => {

				if (member.presence.status !== "offline" && member.user.bot == false) {

					userids.push(member.id);

					//  console.log(member)

				}

			})).then(resolve())



			await client.destroy(token)



		})



	})

}




async function openchannel() {

	var number = (userids.length * 50) / 190;

	var approximate = parseInt(number * 100) / 100



	console.log(chalk.yellowBright("ESTIMATED SPEED : " + approximate + "seconds"))



	channels = [];



	var y = 0;



	var h = 0;



	var j = 0;



	return new Promise((resolve, reject) => {



		if (userids.length == 0) {

			resolve()

		} else {



			for (var i = 0; i < userids.length; i++) {



				//  for (var i = 0; i < 1000; i++) {



				setTimeout(function(i) {



					const interceptorId = rax.attach();




					axios(`https://discord.com/api/v8/users/@me/channels`, {

							method: 'POST',

							headers: {

								"Authorization": 'Bot ' + token,

								"Content-Type": "application/json",

							},

							data: {
								"recipients": [userids[i]]
							},

							raxConfig: {

								retry: 5,

								onRetryAttempt: err => {

									const cfg = rax.getConfig(err);

									console.log(`Retry attempt #${cfg.currentRetryAttempt}`);

								}
							}

						}).then(resp => {

							y++

							//console.log(resp.data.id)

							channels.push(resp.data.id)

							h++

							console.log(chalk.greenBright("OPENED CHANNEL [#" + h + "]"))

							//console.log(resp)



						})

						.then(prom => {

							if (y >= userids.length) {

								//	if (y >= 1000) {

								resolve(y)

							}



						})

						.catch((e) => {

							j++

							//console.log(e.data)

							console.log(chalk.redBright("Invalid Channel #" + j))

							//console.log(e)

							y++

							if (y >= userids.length) {

								//  	if (y >= 1000) {

								resolve(y)

							}

						})

				}, 25 * i, i);



			}

		}

	})



}




async function dm() {



	var n = 0;



	var g = 0;



	var d = 0;



	return new Promise((resolve, reject) => {

		if (channels.length == 0) {

			resolve()

		} else {



			for (var v = 0; v < channels.length; v++) {



				setTimeout(function(v) {



					const interceptorId = rax.attach();




					axios(`https://discord.com/api/v8/channels/${channels[v]}/messages`, {

							method: 'POST',

							headers: {

								"Authorization": 'Bot ' + token,

								"Content-type": "application/json",

							},

							data: {

								"content": message,

							},

							raxConfig: {

								retry: 5,

								onRetryAttempt: err => {

									const cfg = rax.getConfig(err);

									console.log(`Retry attempt #${cfg.currentRetryAttempt}`);

								}
							}

						}).then(resp => {

							//	console.log(n)

							n++

							g++

							console.log(chalk.greenBright("DM" + " [#" + g + "] " + "SENT"))

							//console.log(resp.id)

							//console.log(resp.status)

						})

						.then(prom => {

							if (n >= channels.length) {

								resolve(n)

							}



						})

						.catch((e) => {

							//  console.log(e.data)

							d++

							console.log("ERROR | FAILED DM" + ' [ #' + d + ' [ ')

							//   console.log(e)



							//  console.log(e)

							n++

							if (n >= channels.length) {

								resolve(n)

							}

						})

				}, 25 * v, v);



			}

		}

	})




}




async function dmone(guild) {



	console.log(chalk.yellowBright("FETCHING MEMBERS"))

	await scrapeuuall(guild)



	console.log(chalk.yellowBright("OPENING DMS"))

	await openchannel()

	console.log(chalk.yellowBright("DMING MEMBERS : " + message))

	await dm()

}



async function dmoneonline(guild) {

	console.log(chalk.yellowBright("FETCHING MEMBERS"))

	await scrapeuuonline(guild)

	console.log(chalk.yellowBright("OPENING DMS"))

	await openchannel()

	console.log(chalk.yellowBright("DMING ONLINE MEMBERS : " + message))

	await dm()

}




async function massdm(guildid) {

	console.log(chalk.yellowBright("FETCHING MEMBERS"))

	await scrapeu(guildid)

	console.log(chalk.yellowBright("OPENING DMS"))

	await openchannel()

	console.log(chalk.yellowBright("DMING MEMBERS : " + message))

	await dm()

}




async function massdmonline(guildid) {

	console.log(chalk.yellowBright("FETCHING MEMBERS"))

	await scrapeonline(guildid)

	console.log(chalk.yellowBright("OPENING DMS"))

	await openchannel()

	console.log(chalk.yellowBright("DMING ONLINE MEMBERS : " + message))

	await dm()

}



//    massdm()



async function dmall(guildid) {

	await getguilds()



	for (var x = 0; x < guildid.length; x++) {



		await massdm(guildid[x])



	}



}




async function dmonline(guildid) {

	await getguilds()



	for (var x = 0; x < guildid.length; x++) {



		await massdmonline(guildid[x])



	}



}




console.log(`

	

 ██████╗██╗  ██╗██████╗  ██████╗ ███╗   ███╗███████╗

██╔════╝██║  ██║██╔══██╗██╔═══██╗████╗ ████║██╔════╝

██║     ███████║██████╔╝██║   ██║██╔████╔██║█████╗  

██║     ██╔══██║██╔══██╗██║   ██║██║╚██╔╝██║██╔══╝  

╚██████╗██║  ██║██║  ██║╚██████╔╝██║ ╚═╝ ██║███████╗

 ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚═╝     ╚═╝╚══════╝

                                                    

`)




inquirer

	.prompt({

		type: 'list',

		name: 'option',

		message: "Who Would You Like To Dm?",

		choices: [new inquirer.Separator(), "All Members", "Online Members"

		],

	})

	.then(async function(answers) {

		//   console.log(JSON.stringify(answers, null, '  '));

		if (answers.option == 'All Members') {

			await dmone(guild)

		} else if (answers.option == 'Online Members') {

			await dmoneonline(guild)

		} else if (answers.option == 'All Bots Guilds & All Members') {

			await dmall(guildid)

		} else if (answers.option == 'All Bots Guilds & Only Online Members') {

			await dmonline(guildid)

		}




	});
