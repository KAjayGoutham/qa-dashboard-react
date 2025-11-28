# QA Dashboard - React

A modern, modular React application for managing QA test modules across multiple environments.

## 📚 Documentation

- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Complete installation and setup instructions
- **[COMPONENTS_PART1.md](./COMPONENTS_PART1.md)** - Common, Layout, and Dashboard components
- **[COMPONENTS_PART2.md](./COMPONENTS_PART2.md)** - Module and Comment components
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Project architecture and design decisions

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Create Component Files
Follow the instructions in `COMPONENTS_PART1.md` and `COMPONENTS_PART2.md` to create all component files.

### 3. Run Development Server
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
```

## ✨ Features

- ✅ Module CRUD operations
- ✅ Multi-environment support (QA, Staging, Production)
- ✅ Status tracking with quick updates
- ✅ Channel management (Voice, SMS, Chat, Email)
- ✅ Comment history with full CRUD
- ✅ Search, filter, and sort
- ✅ Dark mode
- ✅ Import/Export functionality
- ✅ Real-time statistics and charts
- ✅ LocalStorage persistence

## 📁 Project Structure

```
src/
├── components/
│   ├── common/          # Reusable UI components
│   ├── layout/          # Layout components
│   ├── dashboard/       # Dashboard-specific components
│   ├── modules/         # Module management components
│   └── comments/        # Comment system components
├── hooks/               # Custom React hooks
├── context/             # React Context providers
├── utils/               # Utility functions and constants
├── styles/              # CSS styles
├── App.jsx              # Main application component
└── main.jsx             # Application entry point
```

## 🛠️ Tech Stack

- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Bootstrap 5** - CSS framework
- **Chart.js** - Data visualization
- **Context API** - State management

## 📖 Component Reference

All components are documented in the reference files:
- See `COMPONENTS_PART1.md` for common, layout, and dashboard components
- See `COMPONENTS_PART2.md` for module and comment components

## 🎯 Next Steps

1. Review `SETUP_GUIDE.md` for detailed setup instructions
2. Create all component files from the reference documents
3. Run `npm install` to install dependencies
4. Start the dev server with `npm run dev`
5. Access the app at `http://localhost:5173`

## 📝 License

This project preserves all functionality from the original QA Dashboard while providing a modern, maintainable React architecture.
