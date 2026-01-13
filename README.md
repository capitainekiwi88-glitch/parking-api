# 🛠️ Parkest API - Back-end Service

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)

Ceci est l'API REST de l'application **Parkest**. Elle gère l'authentification des utilisateurs, la sauvegarde de leurs préférences de stationnement et la communication avec la base de données.

---

## 🏗️ Architecture Technique

L'API est construite avec **Node.js** et le framework **Express**. Les données sont stockées sur un cluster **MongoDB Atlas**.

### Points clés :
* **Authentification :** Gestion des inscriptions et connexions.
* **Persistance :** Stockage des filtres utilisateur (PMR, électrique, gratuité).
* **Sécurité :** Utilisation de variables d'environnement pour masquer les accès à la base de données.
* **CORS :** Configuré pour autoriser les requêtes provenant du Front-end (Vercel).

---

## ⚙️ Configuration (Variables d'Environnement)

Pour fonctionner, cette API nécessite une variable d'environnement nommée `MONGO_URI`. Elle n'est **pas incluse dans le code** pour des raisons de sécurité.

**Sur Render :**
1. Allez dans `Dashboard > Environment`.
2. Ajoutez `MONGO_URI` avec votre lien de connexion MongoDB Atlas.

---

## 🛣️ Routes de l'API

| Méthode | Route | Description |
| :--- | :--- | :--- |
| `POST` | `/api/register` | Crée un nouvel utilisateur. |
| `POST` | `/api/login` | Connecte un utilisateur existant. |
| `POST` | `/api/updateParams` | Met à jour les filtres (PMR, etc.). |
| `GET` | `/api/getParams` | Récupère les préférences de l'utilisateur. |

---

## 🚀 Déploiement

Cette API est déployée sur **Render**. 
* **URL de production :** `https://parking-api-ymux.onrender.com/api/`
* **Note :** En raison de l'hébergement gratuit, le serveur peut mettre ~30 secondes à démarrer lors de la première requête (Cold Start).

---

## 🛠️ Installation en Local

1. Clonez le dépôt :
   ```bash
   git clone [https://github.com/capitainekiwi88-glitch/parking-api.git](https://github.com/capitainekiwi88-glitch/parking-api.git)
