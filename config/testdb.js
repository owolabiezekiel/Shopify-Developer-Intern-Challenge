const mongoose = require("mongoose");
const connectTestDB = async () => {
  const dbconn = await mongoose.connect(process.env.MONGO_TEST_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });

  console.log(
    `MongoDB Connected: ${dbconn.connection.host} test server`.cyan.underline
      .bold
  );
};

module.exports = connectTestDB;
