const Discord = require("discord.js");
const TOKEN = "MzE3ODg5ODgwNjY1MzU4MzM2.DAqZzw.gC0waX24V_cuB_aQi7NU3x6LFbA";
const PREFIX = "!";

var bot = new Discord.Client();
var servers={};
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

String.prototype.supplant = function (o) {
    return this.replace(/{([^{}]*)}/g,
        function (a, b) {
            var r = o[b];
            return typeof r === 'string' || typeof r === 'number' ? r : a;
        }
    );
};


bot.on("message",function(message){
    if(message.author.equals(bot.user)) return;

    if(!message.content.startsWith(PREFIX)) return;

    var content = message.content.substring(PREFIX.length).split(" ");

    switch(content[0].toLowerCase()){
        case "hello":
            message.channel.send("Hello " + message.member.toString() + "!");
            break;
        case "8ball":
            var questionMark= content[content.length-1].slice(-1);

            if(content[1] && questionMark=="?"){
                message.channel.send(fortunes[Math.floor(Math.random()*fortunes.length)]);
            }
            else message.channel.send("Not a valid question!"); 
            break;
        case "help":
            var embed = new Discord.RichEmbed()
                .addField("!hello","Says hello.")
                .addField("!8ball","Ask a question and it will respond. (Make sure you put a question mark at the end.)")
                .setDescription("All the commands:")
                .setColor(0xffffff);
            message.channel.send({embed});
            break;   
        default:
            message.channel.send("Invalid Command. Type {prefix}help for valid commands!".supplant({prefix:PREFIX}));
    }
});

bot.on("ready",function(){
    console.log("Ready");
});

bot.login(TOKEN);