# DoneIt - Task Tracker

DoneIt is a simple task tracker application built as part of the Firebase course at ITI. It allows users to sign up, sign in, and manage their tasks efficiently. The application is built using Firebase for authentication and Firestore for data storage. The project also utilizes JavaScript modules for better code organization and data encapsulation.

## Features

- **User Authentication**: Sign up and sign in using email and password.
- **Task Management**: Add, update, delete, and toggle the status of tasks.
- **Task Filtering**: Filter tasks by status (all, pending, completed).
- **Task Search**: Search for tasks by title.
- **Responsive Design**: The application is responsive and works well on different screen sizes.
- **Modular Code**: The project uses JavaScript modules for better code organization and data hiding.

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript (ES6 Modules)
- **Backend**: Firebase (Authentication, Firestore)

## Setup Instructions

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/doneit-task-tracker.git
   cd doneit-task-tracker
   ```

2. **Install Dependencies**:
   Since this project uses Firebase via CDN, there are no additional dependencies to install.

3. **Set Up Firebase**:
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/).
   - Add a web app to your Firebase project and copy the Firebase configuration.
   - Replace the `firebaseConfig` object in `main.js` with your Firebase configuration.

4. **Run the Application**:
   - Open the `index.html` file in your browser to start using the application.

## ERD (Entity-Relationship Diagram)

The application uses Firestore to store tasks. Below is the ERD for the Firestore collections:

```
users (Collection)
├── userId (Document)
│   ├── email: String
│   └── tasks (Subcollection)
│       ├── taskId (Document)
│       │   ├── title: String
│       │   ├── description: String
│       │   ├── status: String ("pending" or "completed")
│       │   └── userId: String (Reference to the user)
```
+-------------------+          +-------------------+
|      Users        |          |      Tasks        |
+-------------------+          +-------------------+
| email: String     |<-------->| title: String     |
+-------------------+          | description: String|
                               | status: String    |
                               | userId: String    |
                               +-------------------+

## Data Model

- **Users Collection**:
  - `email`: The email address of the user.
  - `tasks`: A subcollection of tasks associated with the user.

- **Tasks Collection**:
  - `title`: The title of the task.
  - `description`: The description of the task.
  - `status`: The status of the task, either "pending" or "completed".
  - `userId`: The ID of the user who created the task.

## Main JavaScript File (`main.js`)

The `main.js` file contains all the logic for user authentication and task management. Below is a summary of the main functions:

- **Authentication**:
  - `signUp()`: Handles user sign-up.
  - `signIn()`: Handles user sign-in.
  - `signOut()`: Handles user sign-out.

- **Task Management**:
  - `addTask()`: Adds a new task or updates an existing task.
  - `getTasks()`: Retrieves and displays tasks based on the selected filter and search query.
  - `toggleTaskStatus()`: Toggles the status of a task between "pending" and "completed".
  - `editTask()`: Populates the form with task details for editing.
  - `deleteTask()`: Deletes a task after confirmation.

- **Utility Functions**:
  - `clearInputs()`: Clears the form inputs after adding or updating a task.
  - `search()`: Handles the search functionality for tasks.
  - `filter()`: Handles the filtering of tasks by status.

## Screenshots

![Sign Up Page]![image](https://github.com/user-attachments/assets/70b7e261-c392-4027-b2f4-8724d0103971)
![Sign In Page]![image](https://github.com/user-attachments/assets/e3422b25-586b-42ce-99ef-3c592bff371e)
![Main Page]![image](https://github.com/user-attachments/assets/fd688015-338d-4606-8851-188c693babc5) ![image](https://github.com/user-attachments/assets/8fbc3afa-486c-4968-9e4b-d9f9bc78f823)

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue if you find any bugs or have suggestions for improvements.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
