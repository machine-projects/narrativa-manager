import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI ;
const options = {
    useNewUrlParser: true, // Garante compatibilidade com a versão do driver
    useUnifiedTopology: true, // Melhora o gerenciamento de conexões
  };

  let client;
  let clientPromise;
  
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
  
  export default clientPromise;