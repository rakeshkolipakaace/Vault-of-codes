# Barter Marketplace Frontend

React + Vite + Material-UI frontend for the Barter Marketplace application.

## Features

- **Modern React**: Built with React 18 and functional components
- **Fast Development**: Vite for lightning-fast development experience
- **Beautiful UI**: Material-UI components for modern design
- **Responsive Design**: Mobile-first responsive layout
- **State Management**: Context API for global state
- **Routing**: React Router for navigation
- **API Integration**: Axios for HTTP requests

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Material-UI** - Component library
- **React Router** - Navigation
- **Axios** - HTTP client
- **Context API** - State management

## Components

### Authentication
- `Login.jsx` - User login form
- `Register.jsx` - User registration form

### Projects
- `ProjectList.jsx` - Browse and search projects
- `ProjectDetail.jsx` - View project details and submit bids
- `PostProject.jsx` - Create new projects

### Shared
- `AuthContext.jsx` - Authentication state management
- `api.js` - API configuration and interceptors

## Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

4. **Preview production build:**
   ```bash
   npm run preview
   ```

## Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### File Structure
```
frontend/
├── src/
│   ├── components/      # React components
│   │   ├── Auth/       # Authentication components
│   │   └── Projects/   # Project-related components
│   ├── contexts/       # React contexts
│   ├── api/           # API configuration
│   ├── App.jsx        # Main app component
│   └── main.jsx       # Entry point
├── public/            # Static assets
├── package.json       # Dependencies and scripts
├── vite.config.js     # Vite configuration
└── index.html         # HTML template
```

## Key Features

### Authentication
- JWT token management
- Protected routes
- Automatic token refresh
- Logout functionality

### Project Management
- Browse projects with search and filtering
- View project details
- Submit bids with skill exchanges
- Post new projects

### User Experience
- Loading states
- Error handling
- Form validation
- Responsive design
- Modern UI components

## API Integration

The frontend communicates with the backend through:
- **Base URL**: `http://localhost:5000/api` (configurable)
- **Authentication**: Bearer token in Authorization header
- **Error Handling**: Automatic 401 redirect to login
- **Request/Response Interceptors**: Global error handling

## Styling

- **Material-UI**: Component library and theming
- **Responsive Design**: Mobile-first approach
- **Custom Theme**: Primary and secondary colors
- **Consistent Spacing**: Material Design spacing system

## State Management

- **AuthContext**: User authentication state
- **Local Storage**: Token and user data persistence
- **Component State**: Local component state with useState
- **API State**: Loading and error states

## Routing

- **Protected Routes**: Authentication-required pages
- **Public Routes**: Login and registration
- **Navigation**: App bar with dynamic menu items
- **Redirects**: Automatic redirects based on auth status

## Contributing

1. Follow React best practices
2. Use functional components and hooks
3. Maintain consistent styling with Material-UI
4. Add proper error handling
5. Test all user flows
6. Ensure responsive design 