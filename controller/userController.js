import User from "../models/userModel.js"

const getAllUsers = async (req, res) => {
    try{
        const users = await User.find();
        res.status(200).json(users);
    }   
    catch(err)
    {
        console.error(err);
        res.status(500).json({error : err.message});
    }
};


export { getAllUsers };
