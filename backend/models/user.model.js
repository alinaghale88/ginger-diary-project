import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

// static signup method
userSchema.statics.signup = async (email, password) => {
    const exists = await User.findOne({ email })

    if (exists) {
        throw Error('Email already in use')
    }
}

const User = mongoose.model('User', userSchema);

export default User;