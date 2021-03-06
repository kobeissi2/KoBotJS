const Discord = require("discord.js");
var giphy = require('giphy-api')();
const YTDL = require("ytdl-core");
const PREFIX = "!";

var bot = new Discord.Client();
var servers = {};
var fortunes = [
    "It is certain.",
    "It is decidedly so.",
    "Without a doubt.",
    "Yes definitely.",
    "You may rely on it.",
    "As I see it, yes.",
    "Most likely.",
    "Outlook good.",
    "Yes.",
    "Signs point to yes.",
    "Reply hazy try again.",
    "Ask again later.",
    "Better not tell you now.",
    "Cannot predict now.",
    "Concentrate and ask again.",
    "Don't count on it.",
    "My reply is no.",
    "My sources say no.",
    "Outlook not so good.",
    "Very doubtful."
];
var dice = [1, 2, 3, 4, 5, 6];
var coin = ["heads", "tails"];
var servers = {};

String.prototype.supplant = function (o) {
    return this.replace(/{([^{}]*)}/g,
        function (a, b) {
            var r = o[b];
            return typeof r === 'string' || typeof r === 'number' ? r : a;
        }
    );
};

function play(connection, message) {
    var server = servers[message.guild.id];
    server.dispatcher = connection.playStream(YTDL(server.queue[0], {
        filter: "audioonly"
    }));
    server.queue.shift();
    server.dispatcher.on("end", function () {
        if (server.queue[0]) play(connection, message);
        else connection.disconnect();
    });
}

function reverseString(string) {
    return string.split("").reverse().join("")
};

function setDefaultGame() {
    return function () {
        bot.user.setGame("!help")
    }
};

bot.on("message", function (message) {
    if (message.author.equals(bot.user)) return;

    if (!message.content.startsWith(PREFIX)) return;

    var content = message.content.substring(PREFIX.length).split(" ");

    switch (content[0].toLowerCase()) {
        case "hello":
            message.channel.send("Hello " + message.member.toString() + "!");
            break;
        case "8ball":
            var questionMark = content[content.length - 1].slice(-1);

            if (content[1] && questionMark == "?") {
                message.channel.send(fortunes[Math.floor(Math.random() * fortunes.length)]);
            } else message.channel.send("Not a valid question!");
            break;
        case "roll":
            message.channel.send("The number rolled is " + dice[Math.floor(Math.random() * dice.length)] + "!");
            break;
        case "flip":
            message.channel.send("The coin flipped to " + coin[Math.floor(Math.random() * coin.length)] + "!");
            break;
        case "reverse":
            if (content[1]) {
                var string = "";
                for (i = 1; i < content.length; i++) {
                    string = string + content[i] + " ";
                }
                var reversed = reverseString(string);
                message.channel.send(reversed);
            } else {
                message.channel.send("Not a string!");
            }
            break;
        case "giphy":
            var string = "";
            if (content[1]) {
                for (i = 1; i < content.length; i++) {
                    string = string + content[i] + " ";
                }
            } else {
                string = "pokemon";
            }
            giphy.search(string).then(function (res) {
                message.channel.send(res.data[Math.floor(Math.random() * res.data.length)].images.original.url);
                return;
            });
            break;
        case "setgame":
            var string = "";
            if (content[1]) {
                if (content[2]) {
                    for (i = 1; i < content.length; i++) {
                        string = string + content[i] + " ";
                    }
                } else string = content[1];
                bot.user.setGame(string);
            } else {
                message.channel.send("No status sent. Setting to default!");
                setDefaultGame();
            }
            setTimeout(setDefaultGame(), 1800000);
            break;
        case "play":
            if (!content[1]) {
                message.channel.send("Please provide a link!");
                return;
            }
            if (!message.member.voiceChannel) {
                message.channel.send("Please join a voice channel!");
                return;
            }
            if (!servers[message.guild.id]) servers[message.guild.id] = {
                queue: []
            };
            var server = servers[message.guild.id];
            server.queue.push(content[1]);
            if (!message.guild.voiceConnection) message.member.voiceChannel.join().then(function (connection) {
                play(connection, message);
            });
            break;
        case "stop":
            var server = servers[message.guild.id];
            if (server.dispatcher) server.dispatcher.end();
            break;
        case "copy":
            if (content[1]) {
                var string = "";
                for (i = 1; i < content.length; i++) {
                    string = string + content[i] + " ";
                }
                bot.channels.get('1').send(string);
            } else {
                message.channel.send("No message supplied");
            }
            break;
        case "help":
            var embed = new Discord.RichEmbed()
                .addField("!hello", "Says hello.")
                .addField("!8ball", "Ask a question and it will respond. (Make sure you put a question mark at the end.)")
                .addField("!roll", "Rolls a number on a die.")
                .addField("!flip", "Flips a coin.")
                .addField("!reverse", "Reverses the string sent.")
                .addField("!giphy", "Gets a random gif from Giphy. Use !giphy <string> to search for gif.")
                .addField("!setgame", "Sets the bot's game status for 30 min.")
                .addField("!play", "Plays music/audio.")
                .addField("!stop", "Stops all audio playing.")
                .addField("!copy", "Copies whatever you sent and sends it to the main channel.")
                .setDescription("All the commands:")
                .setColor(0xffffff);
            message.channel.send(message.member.toString() + ", check your PM!");
            message.author.send({
                embed
            });
            break;
        default:
            message.channel.send("Invalid Command. Type {prefix}help for valid commands!".supplant({
                prefix: PREFIX
            }));
    }
});

bot.on("ready", function () {
    console.log("Ready");
    bot.user.setGame("!help");
});

bot.login(TOKEN);