const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = 2410;

app.use(bodyParser.json());
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
// MongoDB connection string
mongoose.connect('mongodb://localhost:27017/userDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    addresses: [{
        city: String,
        state: String,
        houseNo: String,
        country: String,
        status: { type: String, default: 'valid' }
    }]
});

const User = mongoose.model('User', userSchema);

app.post('/user', async (req, res) => {
    try {
        const { name, age, addresses } = req.body;
        if (!name || !age || !addresses) {
            return res.status(400).send('Bad Request: Missing required fields.');
        }

        const newUser = new User({ name, age, addresses });
        const savedUser = await newUser.save();
        res.status(201).send(savedUser);
    } catch (error) {
        console.error('Error adding user:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.put('/user/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, age, addresses } = req.body;
        const updatedUser = await User.findByIdAndUpdate(id, { name, age, addresses }, { new: true, runValidators: true });

        if (!updatedUser) {
            return res.status(404).send('User not found');
        }

        res.send(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/user', async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Internal Server Error');
    }
});


app.get('/users/:Id', async (req, res) => {
    try {
       
        if (req.params.Id) {
          
            const user = await User.findById(req.params.Id);
            if (!user) {
                return res.status(404).send('User not found');
            }
            return res.send(user);
        } else {
            // Retrieve all users
            const users = await User.find({});
            return res.send(users);
        }
    } catch (error) {
        console.error('Error fetching users:', error);
        return res.status(500).send('Internal Server Error');
    }
});

app.delete('/user/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).send('User not found');
        }

        res.send(deletedUser);
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
