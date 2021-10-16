const mongoose = require('mongoose');

reqstring = {
	type: String,
	required: true
};
const botSet = new mongoose.Schema({
	_id: reqstring,
	guild_name: String,
	prefix: {
		default: '-',
		type: String
	},
	system_channel_id: String,
	starboard_channel_id: String,
	admin_role_id: String,
	mod_role_id: String,
	mute_role_id: String,
	auto_role_id: String,
	auto_kick: Number,
	random_embed: {
	  type: Boolean,
	  default: false
	},
	mod_channel_ids: String,
	disabled_commands: String,
	mod_log_id: String,
	member_log_id: String,
	nickname_log_id: String,
	role_log_id: String,
	message_edit_log_id: String,
	message_delete_log_id: String,
	verification_role_id: String,
	verification_channel_id: String,
	verification_message: String,
	verification_message_id: String,
	welcome_channel_id: String,
	welcome_message: String,
	farewell_channel_id: String,
	farewell_message: String
});

module.exports = mongoose.model('Bot-Settings', botSet);
