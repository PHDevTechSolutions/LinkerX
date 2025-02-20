import { MongoClient, ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import { Server } from "socket.io";

// Ensure the MONGODB_URI environment variable is defined
if (!process.env.MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

const uri = process.env.MONGODB_URI;
let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient>;

// MongoDB connection handling
if (process.env.NODE_ENV === "development") {
  if (!global._mongoClient) {
    client = new MongoClient(uri);
    global._mongoClient = client;
  } else {
    client = global._mongoClient;
  }
  clientPromise = client.connect();
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

// Export the promise to be used for database connections
export default clientPromise;

// Connect to the database
export async function connectToDatabase() {
  const client = await clientPromise;
  return client.db("ecocsr"); // Return the 'ecoshift' database
}

// Function to broadcast new posts
let io: Server | null = null;
export function setSocketServer(server: Server) {
  io = server;
}