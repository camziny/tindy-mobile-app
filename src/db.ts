import mongoose from "mongoose";

const connectToDataBase = async () => {
  try {
    const connection = await mongoose.connect(
      "mongodb+srv://cameronziny:6VTLXV010OtTXBD3@cluster0.fipviwn.mongodb.net/tindy-app?retryWrites=true&w=majority"
    );
    if (connection) {
      console.log("connected established");
    }
  } catch (error) {
    console.log("error in connectToDatabase", error);
    throw error;
  }
};

export default connectToDataBase;
