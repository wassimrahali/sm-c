<b style="color: red;">Smart conseil </b>
# Book Management Application – Fullstack (Angular 16 + Flask) :

## 🎟 Objectif
Mini application CRUD pour gérer une collection de livres :
- Front-end Angular 16
- Back-end Flask RESTful
- Base de données PostgeSql Nean db (online database)
- Déploiement via Docker

---

## 🔧 Fonctionnalités

### Front-end (Angular 16)
- Liste des livres (titre, auteur, année)
- Ajout d’un livre via formulaire réactif avec validation
- Modification ou suppression d’un livre
- Communication avec l’API Flask (GET, POST, PUT, DELETE)

### Back-end (Flask)
- Routes RESTful :
  - `GET /books` – Liste des livres
  - `POST /books` – Ajouter un livre
  - `PUT /books/<id>` – Modifier un livre
  - `DELETE /books/<id>` – Supprimer un livre
- ORM : SQLAlchemy
- Base de données : PostgeSql Nean db (online database)

---

## 📊 Modèle Conceptuel de Données (MCD)
- Entité principale : `Livre`
- Attributs : `id`, `titre`, `auteur`, `annee`, `book_image` (optionnel)
- Fichier PDF inclus : [`MCD_Books.pdf`](./MCD_Books.pdf)

---

## 📚 Structure du projet
```
project/
│
├─ backend/
│  ├─ app.py
│  ├─ models.py
│  ├─ requirements.txt
│  └─ Dockerfile
│
├─ frontend/
│  ├─ angular.json
│  ├─ package.json
│  ├─ src/
│  │   ├─ app/
│  │   ├─ assets/
│  │   └─ index.html
│  └─ Dockerfile
│
├─ docker-compose.yml
├─ README.md
└─ MCD_Books.pdf
```

---

## 💻 Installation et exécution

### Avec Docker (recommandé)
```bash
# Cloner le projet
git clone <votre-repo-url>
cd project

# Lancer avec Docker Compose
docker-compose up --build

# Front-end Angular : http://localhost:4200
# Back-end Flask : http://localhost:5000
```

### Sans Docker
#### Back-end Flask
```bash
cd backend
python -m venv venv
source venv/bin/activate    # Linux/macOS
venv\Scripts\activate       # Windows
pip install -r requirements.txt
python app.py
# API : http://localhost:5000
```

#### Front-end Angular
```bash
cd frontend
npm install
ng serve
# Front-end : http://localhost:4200
```

---

## 🔗 API Endpoints
| Méthode | Route              | Description        |
|---------|------------------|------------------|
| GET     | /books            | Liste des livres |
| POST    | /books            | Ajouter un livre |
| PUT     | /books/<id>       | Modifier un livre |
| DELETE  | /books/<id>       | Supprimer un livre |

---

## ✅ Critères d’évaluation
- CRUD opérationnel et testable
- Formulaire Angular réactif avec validation
- MCD correctement implémenté
- Code propre et structuré (front + back)
- Déploiement Docker fonctionnel
- Documentation claire

---

## 🏧 Docker

### Backend Dockerfile (Flask)
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["python", "app.py"]
```

### Frontend Dockerfile (Angular)
```dockerfile
FROM node:20 as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --prod

FROM nginx:alpine
COPY --from=build /app/dist/<your-angular-app-name> /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### docker-compose.yml
```yaml
version: '3.9'
services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    volumes:
      - ./backend:/app
  frontend:
    build: ./frontend
    ports:
      - "4200:80"
    depends_on:
      - backend
```

---

## 📝 Mehdi Ben Fekhta in 03/10/2025
