/*const { MessageEmbed } = require('discord.js');
const schedule = require('node-schedule');
const { stripIndent } = require('common-tags');
*/
const botSet = require('../../schemas/botschema');
//const userSet = require('../schemas/userschema');

let prefixcache = {};
let disabled_command = [];
let modchannels = [];
let embedcolor = {};

async function getprefix(guildId) {
  const prefix = prefixcache[guildId];
  if (prefix) {
    return prefix;
  }
  try {
    console.log('searching db');
    const preflix = await botSet.findOne({
      _id: guildId
    });

    const ore = preflix.prefix;
    prefixcache[guildId] = ore;
    return ore;
  } catch (err) {
    console.log(err);
  }
}

async function setprefix(guildId, prefix) {
  let Guild = await botSet.findOneAndUpdate(
  {
    _id: guildId
  },
  {
    prefix: prefix
  },
  {
    upsert: true,
    new: true
  });
  prefixcache[guildId] = Guild.prefix;
  console.log(Guild.prefix);
}

async function discmd(guildId) {
  console.log('running');
  let vt = await botSet.findOne({
    _id: guildId
  });
  const cmds = vt.disabled_commands;
  disabled_command[guildId] = cmds;
}

function discmds(guild) {
  return disabled_command[guild];
}

async function getmodchannels(guildid) {
  let vet = await botSet.findOne({
    _id: guildid
  });
  const channels = vet.mod_channel_ids;
  modchannels[guildid] = channels;
}

function mod_channels(guildid) {
  return modchannels[guildid];
}

async function updatedisabledcommands(guildid, disabled) {
  let net = await botSet.findOneAndUpdate(
  {
    _id: guildid
  },
  {
    disabled_commands: disabled
  },
  {
    upsert: true,
    new: true
  });
  disabled_command[guildid] = net.disabled_commands;
}

async function updateModChannels(guildid, id) {
  let vt = await botSet.findOneAndUpdate(
  {
    _id: guildid
  },
  {
    mod_channel_ids: id
  },
  {
    upsert: true,
    new: true
  });
  modchannels[guildid] = vt.mod_channel_ids;
}

//embed color setting

async function getColor(guildId){
 let guild = await botSet.findOne({
   _id: guildId
 })
 embedcolor[guildId] = guild.random_embed || false ;
 return embedcolor[guildId]
 
}

function embedColor(guildId){
  return embedcolor[guildId]
}
//Has to be done here becoz the embeds used are greater
async function setColor(guildId, value){
 let now = await botSet.findOneAndUpdate({
    _id: guildId
  },{
    random_embed: value
  },{
    upsert: true,
    new: true
  })
  embedcolor[guildId] = now.random_embed;
}
/**
 * Capitalizes a string
 * @param {string} string 
 */
function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Removes specifed array element
 * @param {Array} arr
 * @param {*} value
 */
function removeElement(arr, value) {
  var index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}

/**
 * Trims array down to specified size
 * @param {Array} arr
 * @param {int} maxLen
 */
function trimArray(arr, maxLen = 10) {
  if (arr.length > maxLen) {
    const len = arr.length - maxLen;
    arr = arr.slice(0, maxLen);
    arr.push(`and **${len}** more...`);
  }
  return arr;
}

/**
 * Trims joined array to specified size
 * @param {Array} arr
 * @param {int} maxLen
 * @param {string} joinChar
 */
function trimStringFromArray(arr, maxLen = 2048, joinChar = '\n') {
  let string = arr.join(joinChar);
  const diff = maxLen - 15; // Leave room for "And ___ more..."
  if (string.length > maxLen) {
    string = string.slice(0, string.length - (string.length - diff));
    string = string.slice(0, string.lastIndexOf(joinChar));
    string = string + `\nAnd **${arr.length - string.split('\n').length}** more...`;
  }
  return string;
}

/**
 * Gets current array window range
 * @param {Array} arr
 * @param {int} current
 * @param {int} interval
 */
function getRange(arr, current, interval) {
  const max = (arr.length > current + interval) ? current + interval : arr.length;
  current = current + 1;
  const range = (arr.length == 1 || arr.length == current || interval == 1) ? `[${current}]` : `[${current} - ${max}]`;
  return range;
}


/**
 * Gets the ordinal numeral of a number
 * @param {int} number
 */
function getOrdinalNumeral(number) {
  number = number.toString();
  if (number === '11' || number === '12' || number === '13') return number + 'th';
  if (number.endsWith(1)) return number + 'st';
  else if (number.endsWith(2)) return number + 'nd';
  else if (number.endsWith(3)) return number + 'rd';
  else return number + 'th';
}

/**
 * Gets the next moderation case number
 * @param {Client} client 
 * @param {Guild} guild
 */
async function getCaseNumber(client, guild, modLog) {

  const message = (await modLog.messages.fetch({ limit: 100 })).filter(m => m.member === guild.me &&
    m.embeds[0] &&
    m.embeds[0].type == 'rich' &&
    m.embeds[0].footer &&
    m.embeds[0].footer.text &&
    m.embeds[0].footer.text.startsWith('Case')
  ).first();

  if (message) {
    const footer = message.embeds[0].footer.text;
    const num = parseInt(footer.split('#').pop());
    if (!isNaN(num)) return num + 1;
  }

  return 1;
}

/**
 * Gets current status
 * @param {...*} args
 */
function getStatus(...args) {
  for (const arg of args) {
    if (!arg) return 'disabled';
  }
  return 'enabled';
};

module.exports = {
  getprefix,
  discmd,
  discmds,
  setprefix,
  getmodchannels,
  mod_channels,
 updateModChannels,
 updatedisabledcommands,  
  capitalize,
  removeElement,
  trimArray,
  trimStringFromArray,
  getRange,
  getOrdinalNumeral,
  getCaseNumber,
  getStatus,
  getColor,
  embedColor,
  setColor
};