const mongoose = require('mongoose');
module.exports = async () => {
  try {
    await mongoose.connect(
		process.env.db,
		{
			useNewUrlParser: true,
			useUnifiedTopology: true
		}
	);
   console.log('Connected to mongo!')
    }catch(err){
      console.log(err)
    };
	
	return mongoose;
};
