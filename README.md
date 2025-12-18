# Library Management System (LMS)

A modern, client-side Library Management System built with HTML, CSS, and JavaScript using localStorage for data persistence.

## Features

- **Book Management**: Add, edit, delete, and search books
- **Member Management**: Add and manage library members
- **Circulation System**: Issue and return books with due date tracking
- **Reports**: View overdue books and recent transactions
- **Data Export/Import**: Backup and restore your data
- **Responsive Design**: Works on desktop and mobile devices
- **Role-based Access**: Different permissions for admin, librarian, and student roles
- **No Server Required**: Runs entirely in the browser using localStorage

## Setup Instructions

### Prerequisites
- Any modern web browser (Chrome, Firefox, Safari, Edge)
- No server setup required!

### Installation

1. **Download the project files** to your computer

2. **Open the application**:
   - Simply open `index.html` in your web browser
   - Or serve it from any web server (optional)
   - The system will auto-login as admin for demo purposes

3. **Start using immediately**:
   - Sample data is automatically loaded
   - All data is stored in your browser's localStorage
   - No database setup required!

## Usage

### Default Login
- **Username**: admin
- **Role**: Administrator (full access)

### Key Features

1. **Book Management**:
   - Add new books with details like title, author, ISBN, etc.
   - Search books by title, author, accession number, or ISBN
   - Edit book information
   - Delete books (only if no active issues)

2. **Member Management**:
   - Add new members with contact information
   - Search members by name, code, or department
   - View member details

3. **Circulation**:
   - Issue books to members
   - Set due dates for returns
   - Return books and calculate fines
   - View recent transactions

4. **Reports**:
   - View overdue books
   - Track fine amounts
   - Monitor circulation activity

## Data Storage

The system uses browser localStorage to store data in three main collections:
- `lms_books`: Stores book information and inventory
- `lms_members`: Stores member information  
- `lms_circulation`: Tracks book issues and returns

## Data Management

### Export Data
- Click "Export Data" to download a JSON backup of all your data
- The backup includes books, members, circulation records, and system settings
- File is automatically named with the current date

### Import Data
- Click "Import Data" to restore from a previously exported backup
- Select a valid JSON backup file
- All existing data will be replaced with the imported data

### Reset Data
- Click "Reset Data" to clear all data and restore sample data
- This action cannot be undone
- Use this to start fresh or test the system

## Customization

### Adding New Roles
Edit the `applyRolePermissions()` function in `app.js` to add new user roles and their permissions.

### Modifying Fine Calculation
Update the fine calculation logic in the `returnBook()` method of the `DataManager` class in `app.js`.

### Styling
Modify `style.css` to customize the appearance and branding.

## Troubleshooting

1. **Data Not Persisting**:
   - Ensure your browser supports localStorage
   - Check if localStorage is disabled in your browser settings
   - Try clearing browser cache and reloading

2. **Import/Export Issues**:
   - Ensure you're importing a valid JSON file exported from this system
   - Check browser console for error messages
   - Try refreshing the page after import

3. **Performance Issues**:
   - Large datasets may slow down the interface
   - Consider exporting and clearing data periodically
   - The system is optimized for up to 1000+ records

## Sample Data

The system comes with sample books and members for testing:
- 5 sample books across different subjects (Programming, Software Engineering, Design Patterns, Web Development)
- 5 sample members from various departments (Computer Science, Mathematics, Physics, Engineering)

## Browser Compatibility

- **Chrome**: Full support
- **Firefox**: Full support  
- **Safari**: Full support
- **Edge**: Full support
- **Internet Explorer**: Not supported (uses modern JavaScript features)

## Security Notes

- This is a client-side demo system
- All data is stored locally in your browser
- No data is sent to external servers
- For production use, consider adding:
  - Server-side validation
  - User authentication
  - Data encryption
  - Regular backups
