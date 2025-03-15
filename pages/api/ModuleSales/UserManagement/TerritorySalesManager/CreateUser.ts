import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/MongoDB";
import bcrypt from "bcrypt";

async function AddUser({ ReferenceID, UserId, Firstname, Lastname, Email, userName, Password, Role, Department, Location, Company, Manager, Status, LoginAttempts, LockUntil,
}: {
  ReferenceID: string;
  UserId: string;
  Firstname: string;
  Lastname: string;
  Email: string;
  userName: string;
  Password: string;
  Role: string;
  Department: string;
  Location: string;
  Company: string;
  Manager: string;
  Status: string;
  LoginAttempts: string;
  LockUntil: string;
}) {
  const db = await connectToDatabase();
  const userCollection = db.collection("users");

  // Check if email or username already exists
  const existingUser = await userCollection.findOne({
    $or: [{ Email }],
  });
  if (existingUser) {
    throw new Error("Email or username already in use");
  }

  // Hash the password using bcrypt
  const hashedPassword = await bcrypt.hash(Password, 10);

  const newUser = {
    ReferenceID,
    UserId,
    Firstname,
    Lastname,
    Email,
    userName,
    Password: hashedPassword,
    Role,
    Department,
    Location,
    Company,
    Manager,
    Status,
    LoginAttempts,
    LockUntil,
    createdAt: new Date(),
  };

  // Insert new user into the database
  await userCollection.insertOne(newUser);

  // Emit event if WebSocket is active
  if (typeof io !== "undefined" && io) {
    io.emit("newUser", newUser);
  }

  return { success: true, message: "User created successfully" };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { ReferenceID, UserId, Firstname, Lastname, Email, userName, Password, Role, Department, Location, Company, Manager, Status, LoginAttempts, LockUntil } =
      req.body;

    // Validate required fields
    if (!ReferenceID || !Firstname || !Lastname || !Email || !userName || !Password || !Role || !Department || !Location || !Company || !Manager || !Status || !LoginAttempts || !LockUntil) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    try {
      const result = await AddUser({
        ReferenceID,
        UserId,
        Firstname,
        Lastname,
        Email,
        userName,
        Password,
        Role,
        Department,
        Location,
        Company,
        Manager,
        Status,
        LoginAttempts,
        LockUntil
      });
      res.status(201).json(result);
    } catch (error: any) {
      console.error("Error:", error.message);
      res.status(400).json({
        success: false,
        message: error.message || "An error occurred while creating the user",
      });
    }
  } else {
    res.status(405).json({
      success: false,
      message: "Method Not Allowed",
    });
  }
}
