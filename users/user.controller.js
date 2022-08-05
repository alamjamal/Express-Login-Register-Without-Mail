
const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {User} = require('_helpers/db');
const userValidate = require("../users/user.validate");
// const User = db.User;

module.exports = {
    login,
    register,
    getAll,
    getCurrent,
    getById,
    updateById,
    deleteById: _delete,
    getByIdForJWT
};

async function register(req, res) {
    const { error } = userValidate(req.body);
    if (error) return res.status(400).json({message:error.message});
    const {email,password} = req.body;
    const findEmail = await User.findOne({email : email});
    if(findEmail) return res.status(400).json({message:"Email Already Taken"});
    const user = new User(req.body);
    user.password = bcrypt.hashSync(password, 10);
    await user.save()
    .then(() => res.status(201).json({...user.toJSON() , message : "Registration Succesfull"}))
    .catch(err => res.json({message:err.message}));
}


async function login(req, res) {
    const {email, password} = req.body;
    const user = await User.findOne({ email : email });
    if (user && bcrypt.compareSync(password, user.password)) {
        const token = jwt.sign({ currentId: user.id }, config.secret, { expiresIn: '7d' });
        res.status(200).json({...user.toJSON(),token})
    } else res.status(403).json({ message: 'Username or Password is Incorrect'})
}


async function getAll(req, res) {
    await User.find()
    .then(users => res.status(200).json(users))
    .catch(err => res.json({message:err.message}));
}

async function getCurrent(req, res) {
    await User.findById(req.user.currentId)
    .then(user => user ? res.status(200).json(user) : res.status(404).json({ message: 'User Not Found'}))
    .catch(err => res.json({message:err.message}));
}

async function getByIdForJWT(id) {
    return await User.findById(id);
}


async function getById(req, res) {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).json({ message: 'Not a Valid id'});
    await User.findById(req.params.id)
    .then(user => user ? res.status(200).json(user) : res.status(404).json({ message: 'User Not Found'}))
    .catch(err => res.json({message:err.message}));
}

async function updateById(req, res) {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).json({ message: 'Not a Valid id'});
    const { error } = userValidate(req.body);
    if (error) return res.status(400).json(error.message);
    const findEmail = await User.findOne({email : req.body.email});
    if(findEmail) return res.status(400).json({message:"Email Already Taken Or id is Invalid"});
    if (req.body.password) return res.status(400).json({message:"Password Cannot be Updated"});
    await User.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then(user => user ? res.json({...user.toJSON(), message:"User Updates Successfully"}) : res.status(404).json({ message: 'User Not Found'}))
    .catch(err => res.json({message:err.message}));  

}


async function _delete(req, res) {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).json({ message: 'Not a Valid id'});
    await User.findByIdAndRemove(req.params.id)
    .then(user => user ? res.status(200).json({ message:'User Deleted Successfully'}) : res.status(404).json({ message: 'User Not Found'}))
    .catch(err => res.json({message:err.message})); 
}


