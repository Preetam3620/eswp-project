TICKETER - IT Asset Management and Ticketing System
============================================
The Enterprise Resource Management System (ERMS) is a centralized platform designed to streamline the management of physical equipment and software licenses in organizations. Built using the MERN stack (MongoDB, Express.js, React, and Node.js), ERMS provides role-based access control, predictive analytics, and an intuitive user interface to ensure seamless resource allocation.

Video Demo - https://drive.google.com/file/d/1OUoFSZ3hVLzQbz9463JMYyoGb9mkq0-j/view?usp=drive_link


## Setup Instructions
### Prerequisites
- [Node.js](https://nodejs.org/) (v16.13.1)
- [MongoDB](https://www.mongodb.com/)
### Steps
1.  **Clone the Repository**:
    `
    git clone https://github.com/Preetam3620/eswp-project.git
    `
2.  **Install Dependencies**:
    -   For the **frontend**:
        `cd frontend
        npm install`
    -   For the **backend**:
        `cd backend
        npm install`

3.  **Configure Environment Variables**: 
    - Create a `.env` file in the `backend` directory with the following values:

        `PORT=4000
        MONGODB_URI=your_mongodb_connection_string
        JWT_SECRET=your_jwt_secret`
    - Create a `.env` file in the `frontend` directory with the following values:

        `
        REACT_APP_BASE_URL="http://localhost:4000/api/st"`

4.  **Start the Backend Server**:


    `cd backend
    npm start`

5.  **Start the Frontend Development Server**:

    `cd frontend
    npm start`

6.  **Open the Application**: Navigate to `http://localhost:3000` in your browser.