// npm i mongodb
const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://23vickysingh_db_user:mfadb_23vickysingh@cluster0.ncl5jda.mongodb.net/test?retryWrites=true&w=majority';

async function run(){
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000
  });
  try {
    await client.connect();
    console.log('Connected!');
  } catch (err) {
    console.error('Connection failed:', err);
  } finally {
    await client.close().catch(()=>{});
  }
}
run();
