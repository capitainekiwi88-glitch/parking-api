const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const mongoURI = "mongodb+srv://admin:sae301@sae301.6nz1bvh.mongodb.net/parkestDB?retryWrites=true&w=majority";

mongoose.connect(mongoURI)
    .then(() => console.log("Connecté à la base de données !"))
    .catch(err => console.log("Erreur de connexion :", err));

const User = mongoose.model('User', new mongoose.Schema({
    username: { type: String, unique: true },
    password: { type: String },
    params: {
        hauteur: Number,
        pmr: Boolean,
        dspOnly: Boolean,
        electrique: Boolean
    }
}));

app.post('/api/register', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(200).json({ message: "OK" });
    } catch (e) { res.status(400).json({ error: "Erreur" }); }
});

app.post('/api/login', async (req, res) => {
    const user = await User.findOne({ username: req.body.username, password: req.body.password });
    if (user) res.status(200).json({ token: user._id });
    else res.status(401).json({ error: "Fail" });
});

app.post('/api/updateParams', async (req, res) => {
    await User.findByIdAndUpdate(req.body.token, { params: req.body });
    res.status(200).json({ message: "OK" });
});

app.get('/api/getParams', async (req, res) => {
    const user = await User.findById(req.query.token);
    res.status(200).json(user ? user.params : {});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Le serveur tourne sur le port " + PORT));