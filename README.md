# Billing App with Backend API 👋

This is a [Expo](https://expo.dev) billing application with a Node.js/Express backend API and MongoDB database integration, created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Features

- 📊 **Invoice Management**: Create, view, and manage invoices
- 🗄️ **MongoDB Integration**: Persistent data storage with MongoDB
- 📱 **Cross-Platform**: Works on iOS, Android, and Web
- 🎨 **Modern UI**: Beautiful and responsive design
- 🔍 **Search & Filter**: Find invoices by customer name
- 📈 **Statistics**: View invoice statistics and analytics

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Set up the backend

   ```bash
   # Install backend dependencies
   cd backend
   npm install
   
   # Configure environment variables
   cp env.example .env
   # Edit .env with your MongoDB connection string
   
   # Start the backend server
   npm run dev
   ```

3. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Backend Setup

This app uses a Node.js/Express backend with MongoDB for data persistence. See [MONGODB_SETUP.md](./MONGODB_SETUP.md) for detailed MongoDB setup instructions.

### Quick Setup

1. **Install MongoDB** locally or use MongoDB Atlas
2. **Set up the backend**:
   ```bash
   cd backend
   npm install
   cp env.example .env
   # Edit .env with your MongoDB connection string
   npm run dev
   ```
3. **The backend will run on** `http://localhost:3000`

## App Structure

- **`app/(tabs)/`**: Main app screens
  - `index.tsx`: Dashboard with statistics
  - `create-invoice.tsx`: Create new invoices
  - `invoices.tsx`: View and manage invoices
- **`services/`**: API and business logic
  - `api.ts`: REST API service for backend communication
- **`hooks/`**: Custom React hooks
  - `useInvoices.ts`: Invoice management hook
- **`backend/`**: Express.js server
  - `server.js`: Main server file with API endpoints
  - `package.json`: Backend dependencies

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
