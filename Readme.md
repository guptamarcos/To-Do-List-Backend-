📝 Todo App (Express + EJS + MongoDB)

A complete Todo Application built using Express.js, MongoDB, and EJS templates, following the MVC architecture.
It features user authentication, session management, data validation, and clean error handling — built with maintainability and scalability in mind.
🚀 Features
✅ User Authentication using Passport.js (Local Strategy)
🧾 CRUD Operations for Todos (Create, Read, Update, Delete)
👥 User-Specific Todos — each user can only view and manage their own todos
🧠 Data Validation with Joi
🧱 Custom Error Handling using a self-defined ExpressError class
🧩 MVC Architecture for modular and organized code
🗄️ MongoDB for database, managed via Mongoose
🔁 Persistent Login Sessions using express-session and connect-mongo
🧹 Cascade Delete: When a user is deleted, all their associated todos are automatically deleted (via Mongoose post middleware)
🧰 Async Error Handling using a reusable wrapAsync utility
🔐 Protected Routes via isLoggedIn middleware
🧩 ObjectId Validation for safe route access
🎨 Vanilla CSS for clean and responsive UI
⚙️ Environment Variables managed with dotenv


🏗️ Project Structure (MVC)
📦 TodoApp
├── 📁 model
│   ├── userSchema.js
│   └── todoSchema.js
│
├── 📁 routes
│   ├── userRoutes.js
│   └── todoRoutes.js
│
├── 📁 controllers
│   ├── userController.js
│   └── todosController.js
│
├── 📁 utils
│   ├── middleware.js
│   ├── schemaValidator.js
│   ├── wrapAsync.js
│   └── ExpressError.js
│
├── 📁 views
│   ├── partials/
│   ├── todos/
│   ├── users/
│
├── 📁 public
│   └── css 
|         ├── Edit.css
|         ├── Home.css
|         ├── Index.css
|         ├── login.css
|         ├── Navbar.css
|         ├── signup.css
│
├── server.js
├── package-lock.json
├── package.json
└── .gitignore
├── .env
└── README.md

🧩 Mongoose Models
🧍 User Schema
Fields: username, email, password, allTodos (array of Todo IDs)
Integrated with passport-local-mongoose for easy authentication
On deleting a user → all associated todos are deleted automatically using Mongoose post middleware

🗒️ Todo Schema
Fields: title, description, createdAt, owner
On deleting a todo → it is removed from the user’s allTodos field

⚙️ Environment Variables (.env)
Variable	Description
PORT ----> Server port
MONGO_URL ----> MongoDB connection URI
SESSION_SECRET ----> Secret key for sessions



🧰 Technologies Used
Category    	      Tech
Backend	              Node.js, Express.js
Database	          MongoDB, Mongoose
Authentication	      Passport.js, passport-local-mongoose
Session Management	  express-session, connect-mongo
Validation	          Joi
Frontend	          EJS, Vanilla CSS
Environment Config	  dotenv