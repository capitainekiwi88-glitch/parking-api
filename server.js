const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { scryptSync, randomBytes, timingSafeEqual } = require('crypto');

const app = express();
app.use(cors());
app.use(express.json());

const hashPassword = (password) => {
    const salt = randomBytes(16).toString('hex');
    const hashedPassword = scryptSync(password, salt, 64).toString('hex');
    return `${salt}.${hashedPassword}`;
};

const verifyPassword = (password, storedValue) => {
    const [salt, storedHash] = storedValue.split('.');
    const hashToVerify = scryptSync(password, salt, 64).toString('hex');
    return timingSafeEqual(Buffer.from(storedHash, 'hex'), Buffer.from(hashToVerify, 'hex'));
};

const mongoURI = process.env.MONGO_URI; 

mongoose.connect(mongoURI)
  .then(() => console.log("Connecté à MongoDB !"))
  .catch(err => console.error("Erreur :", err));

const User = mongoose.model('User', new mongoose.Schema({
    username: { type: String, unique: true },
    password: { type: String },
    params: {
        hauteur: { type: Number, default: 1.90 },
        dspOnly: { type: Boolean, default: false },
        // Tes 3 préférences de parking
        pmr: { type: Boolean, default: false },
        free: { type: Boolean, default: false },
        elec: { type: Boolean, default: false }
    }
}));

// --- Routes API ---

app.post('/api/register', async (req, res) => {
    try {
        const userData = { ...req.body };
        userData.password = hashPassword(userData.password);
        
        if (!userData.params) {
            userData.params = { hauteur: 1.90, pmr: false, free: false, elec: false, dspOnly: false };
        }

        const user = new User(userData);
        await user.save();

        res.status(200).json({ 
            token: user._id, 
            message: "OK" 
        });
    } catch (e) { 
        res.status(400).json({ error: "Erreur lors de l'inscription" }); 
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (user && verifyPassword(req.body.password, user.password)) {
            res.status(200).json({ 
                token: user._id,
                params: user.params 
            });
        } else {
            res.status(401).json({ error: "Identifiants incorrects" });
        }
    } catch (e) { res.status(500).json({ error: "Erreur serveur" }); }
});

app.post('/api/updateParams', async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.body.token, { params: req.body.params });
        res.status(200).json({ message: "OK" });
    } catch (e) { res.status(400).json({ error: "Échec de la mise à jour" }); }
});

app.get('/api/getParams', async (req, res) => {
    try {
        const user = await User.findById(req.query.token);
        res.status(200).json(user ? user.params : {});
    } catch (e) { res.status(404).json({ error: "Utilisateur non trouvé" }); }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Le serveur tourne sur le port " + PORT));

