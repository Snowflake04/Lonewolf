const mongoose = require('mongoose');

const userSet = mongoose.Schema({
	// Guild ID
	user_id: String,
	user_name: String,
	user_discriminator: String,
	guild_id: String,
	guild_name: String,
	date_joined: String,
	bot: Number,
	warns: String,
	current_member: {
		type: Number,
		required: true
	}
});

module.exports = mongoose.model('User-setting', userSet);
