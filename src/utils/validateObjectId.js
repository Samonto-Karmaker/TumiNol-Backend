import mongoose from "mongoose"

export const isValidObjectId = id => mongoose.Types.ObjectId.isValid(id)
