const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
// 1. Importation du module natif crypto
const { scryptSync, randomBytes, timingSafeEqual } = require('crypto');

const app = express();
app.use(cors());
app.use(express.json());

// --- 2. FONCTIONS DE SECURITE (Rien à installer) ---
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
// ----------------------------------------------------

const mongoURI = process.env.MONGO_URI; 

mongoose.connect(mongoURI)
  .then(() => console.log("Connecté à MongoDB !"))
  .catch(err => console.error("Erreur :", err));

const User = mongoose.model('User', new mongoose.Schema({
    username: { type: String, unique: true },
    password: { type: String }, // Sera maintenant stocké sous forme "salt.hash"
    params: {
        hauteur: Number,
        pmr: Boolean,
        dspOnly: Boolean,
        electrique: Boolean
    }
}));

app.post('/api/register', async (req, res) => {
    try {
        // 3. On remplace le mot de passe en clair par le hash
        const userData = { ...req.body };
        userData.password = hashPassword(userData.password);
        
        const user = new User(userData);
        await user.save();
        res.status(200).json({ message: "OK" });
    } catch (e) { res.status(400).json({ error: "Erreur lors de l'inscription" }); }
});

app.post('/api/login', async (req, res) => {
    try {
        // 4. On cherche l'utilisateur par son nom uniquement
        const user = await User.findOne({ username: req.body.username });
        
        // 5. On vérifie le hash
        if (user && verifyPassword(req.body.password, user.password)) {
            res.status(200).json({ token: user._id });
        } else {
            res.status(401).json({ error: "Identifiants incorrects" });
        }
    } catch (e) { res.status(500).json({ error: "Erreur serveur" }); }
});

app.post('/api/updateParams', async (req, res) => {
    // Attention : req.body contient probablement les params, pas le token directement
    // Il vaut mieux passer le token dans le header ou un champ séparé
    await User.findByIdAndUpdate(req.body.token, { params: req.body.params });
    res.status(200).json({ message: "OK" });
});

app.get('/api/getParams', async (req, res) => {
    const user = await User.findById(req.query.token);
    res.status(200).json(user ? user.params : {});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Le serveur tourne sur le port " + PORT));
