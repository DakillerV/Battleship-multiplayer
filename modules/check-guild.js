const { bot } = require('../../bot');

function checkguild(member_id, guilds){
  owner_guilds = [] // the owner guild
  invite_guilds = [] // bot and the guild user share mutual guilds
  bot_guilds = [] // mutual ids
  guilds.forEach(element => {
    if(element.owner == true){
      if(bot.guilds.cache.get(element.id)) owner_guilds.push({"name":element.name, "id":element.id})
      if(!bot.guilds.cache.get(element.id)) invite_guilds.push({"name":element.name, "id":element.id})
    }
  });
  // console.log(invite_guilds, owner_guilds)
  return {invite_guilds, owner_guilds}
}

module.exports = checkguild;
