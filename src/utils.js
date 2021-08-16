const botSet = require('../schemas/botschema');
const userSet = require('../schemas/userschema');

let prefixcache = {};
let disabled_command = [];
let modchannels = [];

module.exports = {
	async getprefix(guildId) {
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
	},

	async setprefix(guildId, prefix) {
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
			}
		);
		prefixcache[guildId] = Guild.prefix;
		console.log(Guild.prefix);
	},

	async discmd(guildId) {
		console.log('running');
		let vt = await botSet.findOne({
			_id: guildId
		});
		const cmds = vt.disabled_commands;
		disabled_command[guildId] = cmds;
	},

	discmds(guild) {
		return disabled_command[guild];
	},

	async getmodchannels(guildid) {
		let vet = await botSet.findOne({
			_id: guildid
		});
		const channels = vet.mod_channel_ids;
		modchannels[guildid] = channels;
	},

	mod_channels(guildid) {
		return modchannels[guildid];
	},

	async updatedisabledcommands(guildid, disabled) {
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
			}
		);
		disabled_command[guildid] = net.disabled_commands;
	},

	async updateModChannels(guildid, id) {
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
			}
		);
		modchannels[guildid] = vt.mod_channel_ids;
	}
};
