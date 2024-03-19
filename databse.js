import mongoose from 'mongoose';

const database = async (mongoUrl)=>{
  try{
    const db = await mongoose.connect(mongoUrl,{
      dbName:'paytm'
    });
    console.log(`🔗🔗🔗🔗 MongoDB Connected to host: ${db.connection.host} and port:${db.connection.port} 🔗🔗🔗🔗`);
    console.log('Connection to the database is successful✅.');
  }catch(error){
    console.error(
      `🔗‍💥🔗‍💥🔗‍💥🔗‍💥  ${error} 🔗‍💥🔗‍💥🔗‍💥🔗‍💥`
    );
    console.log('Could not connect to the database.', error);
    process.exit(1);
  }
}

export default database;
