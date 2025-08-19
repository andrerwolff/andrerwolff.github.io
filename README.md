# Sbmtl - Submittal Review Tool

A modern, responsive web application for reviewing construction submittals against project specifications. This is a proof-of-concept application that demonstrates the user interface and workflow for a submittal review tool.

## Features

### 🎯 **Intro/Onboarding Screen**
- Clean, modern design with technical blueprint graphic
- App introduction and "How it works" explanation
- Call-to-action to get started

### 🏠 **Home Screen**
- Dashboard with new review creation
- Recent reviews section (session-based storage)
- Clean, card-based layout

### 📄 **Review Screen**
- File upload interface for submittals and specifications
- Support for PDF, DOC, and DOCX files (up to 200MB)
- Drag-and-drop functionality
- File validation and management

## File Structure

```
frontend/
├── index.html          # Main HTML file with all three screens
├── styles.css          # CSS styling for modern, responsive design
├── script.js           # JavaScript functionality and screen management
└── README.md           # This file
```

## How to Use

1. **Open the Application**
   - Simply open `index.html` in a modern web browser
   - No server setup required - runs entirely in the browser

2. **Navigation Flow**
   - **Intro Screen** → Click "Get Started" → **Home Screen**
   - **Home Screen** → Click "Start new Review" → **Review Screen**
   - **Review Screen** → Upload files → Click "Get Report" → Returns to **Home Screen**

3. **File Upload**
   - Drag and drop files or click "Browse Files"
   - Supported formats: PDF, DOC, DOCX
   - Maximum file size: 200MB per file
   - Both submittal and spec files required to proceed

4. **Recent Reviews**
   - Reviews are saved in browser session storage
   - Data persists only for the current browser session
   - Click on review items to see details (demo functionality)

## Technical Details

- **Pure HTML/CSS/JavaScript** - No external dependencies
- **Responsive Design** - Works on desktop and mobile devices
- **Session Storage** - Recent reviews saved locally for the session
- **File Validation** - Type and size checking before upload
- **Drag & Drop** - Modern file upload experience

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Modern mobile browsers

## Demo Features

- **File Upload Simulation** - Files are processed but not actually uploaded to any server
- **Report Generation** - Simulated 2-second processing time
- **Session Persistence** - Recent reviews are maintained during the browser session
- **Responsive Layout** - Adapts to different screen sizes

## Future Enhancements

- Backend integration for actual file processing
- AI-powered submittal analysis
- User authentication and account management
- Persistent data storage
- Export functionality for reports
- Advanced file preview capabilities

## Getting Started

1. Clone or download the files to your local machine
2. Open `index.html` in your web browser
3. Start exploring the application!

No build process, package installation, or server setup required. The application runs entirely in the browser for easy testing and demonstration.
