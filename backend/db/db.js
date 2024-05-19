const mongoose= require ("mongoose");
const dotenv= require("dotenv");
dotenv.config();

const mongodbUrl= process.env.mongodbURL
mongoose.connect(mongodbUrl);

const userSchema= mongoose.Schema({
    userName: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true }
  });

const sleepSchema= mongoose.Schema({
    hours: {
        type: Number,
        min:0,
        max:24,
        required:true
    },
    timestamp: Date,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

const User = mongoose.model('User', userSchema);
const Sleep= mongoose.model("Sleep", sleepSchema);

const connect = async () => {
    if (mongoose.connection.readyState === 0) {
      const url = 'mongodb://127.0.0.1/test';
      await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    }
  };
  
  const close = async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  };



module.exports={
    User,
    Sleep,
    connect,
    close
}