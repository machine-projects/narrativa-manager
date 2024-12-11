import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb+srv://projetoia:kVD0sttEsKKoPGQbwnE3b1kj2XII@projeto-ia.65f3n.mongodb.net/?retryWrites=true&w=majority&appName=projeto-ia";
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