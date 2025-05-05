### **Summary of the Application**
This is a **Secure Group Messaging Application** built with a **React frontend** and a **Node.js backend**. The application allows users to:
- Register and log in securely.
- ![image](https://github.com/user-attachments/assets/01cc0471-c6e8-4935-bb0a-dce1511256cd)
- ![image](https://github.com/user-attachments/assets/f8e2a95f-8286-47a3-bcf2-c8006c8c49e7)
- Create and join groups.
- ![image](https://github.com/user-attachments/assets/fa4d3467-a14c-4548-aeb4-7f51e0f3b732)
- Send and receive real-time messages using WebSocket (Socket.IO).
- ![image](https://github.com/user-attachments/assets/cbb960d7-b064-414d-8542-6ebcbf89c2a7)

- View typing indicators and use smart replies for quick responses.
![image](https://github.com/user-attachments/assets/176fcfa6-872f-4109-a8c2-981f6c33f893)

The backend uses **Express.js** and **MongoDB** for data storage, while the frontend is built with **React** for a dynamic user interface.

---

### **Steps to Run the Application**

#### **1. Prerequisites**
Ensure the following are installed on your system:
- **Node.js** (v14 or higher)
- **npm** (comes with Node.js)
- **MongoDB** (local or cloud instance like MongoDB Atlas)

---

#### **2. Clone the Repository**
Clone the project to your local machine:
```bash
git clone https://github.com/your-username/secure-group-messaging-app.git
cd secure-group-messaging-app
```

---

#### **3. Set Up the Backend (Node.js)**
1. Navigate to the backend directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the backend server:
   ```bash
   npm start
   ```
   The backend will run on `http://localhost:5000`.

---

#### **4. Set Up the Frontend (React)**
1. Navigate to the frontend directory:
   ```bash
   cd ../client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the React development server:
   ```bash
   npm start
   ```
   The frontend will run on `http://localhost:3001`.

---

#### **5. Run the Application**
1. Open your browser and navigate to `http://localhost:3001`.
2. Register a new user and log in.
3. Create or join a group and start messaging.

---

#### **6. Optional: Build for Production**
To create a production build of the React app:
1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Build the app:
   ```bash
   npm run build
   ```
---

### **Key Features**
- **Frontend**: React, Axios, WebSocket (Socket.IO)
- **Backend**: Node.js, Express.js, MongoDB
- **Real-Time Messaging**: Powered by Socket.IO
- **Authentication**: JWT-based secure login

This application is now ready to run locally or deploy to a production environment. 
