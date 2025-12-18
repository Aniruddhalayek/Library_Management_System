// app.js
// Data Manager for localStorage
class DataManager {
  constructor() {
    this.initializeData();
  }

  initializeData() {
    // Initialize with sample data if not exists
    if (!localStorage.getItem('lms_books')) {
      const sampleBooks = [
        {
          id: 1,
          accession_no: 'ACC001',
          isbn: '978-0134685991',
          title: 'Effective Java',
          author: 'Joshua Bloch',
          publisher: 'Addison-Wesley',
          year: 2017,
          total_qty: 3,
          available_qty: 3,
          subject: 'Programming'
        },
        {
          id: 2,
          accession_no: 'ACC002',
          isbn: '978-0132350884',
          title: 'Clean Code',
          author: 'Robert C. Martin',
          publisher: 'Prentice Hall',
          year: 2008,
          total_qty: 2,
          available_qty: 2,
          subject: 'Software Engineering'
        },
        {
          id: 3,
          accession_no: 'ACC003',
          isbn: '978-0596007126',
          title: 'Head First Design Patterns',
          author: 'Eric Freeman',
          publisher: 'O\'Reilly Media',
          year: 2004,
          total_qty: 2,
          available_qty: 2,
          subject: 'Design Patterns'
        },
        {
          id: 4,
          accession_no: 'ACC004',
          isbn: '978-0134685991',
          title: 'JavaScript: The Good Parts',
          author: 'Douglas Crockford',
          publisher: 'O\'Reilly Media',
          year: 2008,
          total_qty: 1,
          available_qty: 1,
          subject: 'Web Development'
        },
        {
          id: 5,
          accession_no: 'ACC005',
          isbn: '978-1491950357',
          title: 'Learning React',
          author: 'Alex Banks',
          publisher: 'O\'Reilly Media',
          year: 2020,
          total_qty: 2,
          available_qty: 2,
          subject: 'Web Development'
        }
      ];
      localStorage.setItem('lms_books', JSON.stringify(sampleBooks));
    }

    if (!localStorage.getItem('lms_members')) {
      const sampleMembers = [
        {
          id: 1,
          member_code: 'MEM001',
          name: 'John Smith',
          department: 'Computer Science',
          email: 'john.smith@university.edu',
          phone: '555-0101',
          role: 'student'
        },
        {
          id: 2,
          member_code: 'MEM002',
          name: 'Sarah Johnson',
          department: 'Mathematics',
          email: 'sarah.johnson@university.edu',
          phone: '555-0102',
          role: 'student'
        },
        {
          id: 3,
          member_code: 'MEM003',
          name: 'Mike Wilson',
          department: 'Physics',
          email: 'mike.wilson@university.edu',
          phone: '555-0103',
          role: 'faculty'
        },
        {
          id: 4,
          member_code: 'MEM004',
          name: 'Emily Davis',
          department: 'Computer Science',
          email: 'emily.davis@university.edu',
          phone: '555-0104',
          role: 'student'
        },
        {
          id: 5,
          member_code: 'MEM005',
          name: 'David Brown',
          department: 'Engineering',
          email: 'david.brown@university.edu',
          phone: '555-0105',
          role: 'faculty'
        }
      ];
      localStorage.setItem('lms_members', JSON.stringify(sampleMembers));
    }

    if (!localStorage.getItem('lms_circulation')) {
      localStorage.setItem('lms_circulation', JSON.stringify([]));
    }

    if (!localStorage.getItem('lms_next_ids')) {
      localStorage.setItem('lms_next_ids', JSON.stringify({
        books: 6,
        members: 6,
        circulation: 1
      }));
    }
  }

  getNextId(type) {
    const ids = JSON.parse(localStorage.getItem('lms_next_ids'));
    const nextId = ids[type];
    ids[type]++;
    localStorage.setItem('lms_next_ids', JSON.stringify(ids));
    return nextId;
  }

  getBooks(search = '') {
    const books = JSON.parse(localStorage.getItem('lms_books') || '[]');
    if (!search) return books;
    
    const searchLower = search.toLowerCase();
    return books.filter(book => 
      book.title.toLowerCase().includes(searchLower) ||
      book.author.toLowerCase().includes(searchLower) ||
      book.accession_no.toLowerCase().includes(searchLower) ||
      book.isbn.toLowerCase().includes(searchLower)
    );
  }

  addBook(bookData) {
    const books = JSON.parse(localStorage.getItem('lms_books') || '[]');
    
    // Check if accession number already exists
    if (books.some(book => book.accession_no === bookData.accession_no)) {
      return { status: 'error', message: 'Accession number already exists' };
    }

    const newBook = {
      id: this.getNextId('books'),
      ...bookData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    books.push(newBook);
    localStorage.setItem('lms_books', JSON.stringify(books));
    return { status: 'ok', message: 'Book added successfully' };
  }

  updateBook(id, bookData) {
    const books = JSON.parse(localStorage.getItem('lms_books') || '[]');
    const index = books.findIndex(book => book.id == id);
    
    if (index === -1) {
      return { status: 'error', message: 'Book not found' };
    }

    // Check if accession number already exists (excluding current book)
    if (books.some(book => book.accession_no === bookData.accession_no && book.id != id)) {
      return { status: 'error', message: 'Accession number already exists' };
    }

    books[index] = {
      ...books[index],
      ...bookData,
      updated_at: new Date().toISOString()
    };

    localStorage.setItem('lms_books', JSON.stringify(books));
    return { status: 'ok', message: 'Book updated successfully' };
  }

  deleteBook(id) {
    const books = JSON.parse(localStorage.getItem('lms_books') || '[]');
    const circulation = JSON.parse(localStorage.getItem('lms_circulation') || '[]');
    
    // Check if book has active issues
    const activeIssues = circulation.filter(issue => issue.book_id == id && issue.status === 'issued');
    if (activeIssues.length > 0) {
      return { status: 'error', message: 'Cannot delete book with active issues' };
    }

    const filteredBooks = books.filter(book => book.id != id);
    localStorage.setItem('lms_books', JSON.stringify(filteredBooks));
    return { status: 'ok', message: 'Book deleted successfully' };
  }

  getMembers(search = '') {
    const members = JSON.parse(localStorage.getItem('lms_members') || '[]');
    if (!search) return members;
    
    const searchLower = search.toLowerCase();
    return members.filter(member => 
      member.name.toLowerCase().includes(searchLower) ||
      member.member_code.toLowerCase().includes(searchLower) ||
      member.department.toLowerCase().includes(searchLower)
    );
  }

  addMember(memberData) {
    const members = JSON.parse(localStorage.getItem('lms_members') || '[]');
    
    // Check if member code already exists
    if (members.some(member => member.member_code === memberData.member_code)) {
      return { status: 'error', message: 'Member code already exists' };
    }

    const newMember = {
      id: this.getNextId('members'),
      ...memberData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    members.push(newMember);
    localStorage.setItem('lms_members', JSON.stringify(members));
    return { status: 'ok', message: 'Member added successfully' };
  }

  updateMember(id, memberData) {
    const members = JSON.parse(localStorage.getItem('lms_members') || '[]');
    const index = members.findIndex(member => member.id == id);

    if (index === -1) {
        return { status: 'error', message: 'Member not found' };
    }

    // Check if member code already exists (excluding current member)
    if (members.some(member => member.member_code === memberData.member_code && member.id != id)) {
        return { status: 'error', message: 'Member code already exists' };
    }

    members[index] = {
        ...members[index],
        ...memberData,
        updated_at: new Date().toISOString()
    };

    localStorage.setItem('lms_members', JSON.stringify(members));
    return { status: 'ok', message: 'Member updated successfully' };
  }

  deleteMember(id) {
    const members = JSON.parse(localStorage.getItem('lms_members') || '[]');
    const circulation = JSON.parse(localStorage.getItem('lms_circulation') || '[]');

    // Check if member has active issues
    if (circulation.some(issue => issue.member_id == id && issue.status === 'issued')) {
        return { status: 'error', message: 'Cannot delete member with active issues' };
    }

    const filteredMembers = members.filter(member => member.id != id);
    localStorage.setItem('lms_members', JSON.stringify(filteredMembers));
    return { status: 'ok', message: 'Member deleted successfully' };
  }

  issueBook(bookId, memberId, issueDate, dueDate) {
    const books = JSON.parse(localStorage.getItem('lms_books') || '[]');
    const circulation = JSON.parse(localStorage.getItem('lms_circulation') || '[]');
    
    const book = books.find(b => b.id == bookId);
    if (!book) {
      return { status: 'error', message: 'Book not found' };
    }

    if (book.available_qty <= 0) {
      return { status: 'error', message: 'Book is not available' };
    }

    const newIssue = {
      id: this.getNextId('circulation'),
      book_id: parseInt(bookId),
      member_id: parseInt(memberId),
      issue_date: issueDate,
      due_date: dueDate,
      return_date: null,
      status: 'issued',
      fine_amount: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    circulation.push(newIssue);
    
    // Update available quantity
    book.available_qty--;
    book.updated_at = new Date().toISOString();

    localStorage.setItem('lms_circulation', JSON.stringify(circulation));
    localStorage.setItem('lms_books', JSON.stringify(books));
    
    return { status: 'ok', message: 'Book issued successfully' };
  }

  returnBook(issueId, returnDate) {
    const circulation = JSON.parse(localStorage.getItem('lms_circulation') || '[]');
    const books = JSON.parse(localStorage.getItem('lms_books') || '[]');
    
    const issue = circulation.find(i => i.id == issueId && i.status === 'issued');
    if (!issue) {
      return { status: 'error', message: 'Issue not found or already returned' };
    }

    // Calculate fine
    const dueDate = new Date(issue.due_date);
    const retDate = new Date(returnDate);
    const daysOverdue = Math.max(0, Math.ceil((retDate - dueDate) / (1000 * 60 * 60 * 24)));
    const fine = daysOverdue * 1.00; // 1.00 per day overdue

    issue.return_date = returnDate;
    issue.status = 'returned';
    issue.fine_amount = fine;
    issue.updated_at = new Date().toISOString();

    // Update available quantity
    const book = books.find(b => b.id == issue.book_id);
    if (book) {
      book.available_qty++;
      book.updated_at = new Date().toISOString();
    }

    localStorage.setItem('lms_circulation', JSON.stringify(circulation));
    localStorage.setItem('lms_books', JSON.stringify(books));
    
    return { status: 'ok', message: 'Book returned successfully', fine: fine };
  }

  getRecentIssues() {
    const circulation = JSON.parse(localStorage.getItem('lms_circulation') || '[]');
    const books = JSON.parse(localStorage.getItem('lms_books') || '[]');
    const members = JSON.parse(localStorage.getItem('lms_members') || '[]');
    
    return circulation
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 20)
      .map(issue => {
        const book = books.find(b => b.id == issue.book_id);
        const member = members.find(m => m.id == issue.member_id);
        return {
          ...issue,
          title: book ? book.title : 'Unknown Book',
          name: member ? member.name : 'Unknown Member'
        };
      });
  }

  getOverdue() {
    const circulation = JSON.parse(localStorage.getItem('lms_circulation') || '[]');
    const books = JSON.parse(localStorage.getItem('lms_books') || '[]');
    const members = JSON.parse(localStorage.getItem('lms_members') || '[]');
    const today = new Date();
    
    return circulation
      .filter(issue => {
        if (issue.status !== 'issued') return false;
        const dueDate = new Date(issue.due_date);
        return dueDate < today;
      })
      .map(issue => {
        const book = books.find(b => b.id == issue.book_id);
        const member = members.find(m => m.id == issue.member_id);
        const dueDate = new Date(issue.due_date);
        const daysOverdue = Math.ceil((today - dueDate) / (1000 * 60 * 60 * 24));
        
        return {
          ...issue,
          title: book ? book.title : 'Unknown Book',
          name: member ? member.name : 'Unknown Member',
          days_overdue: daysOverdue
        };
      })
      .sort((a, b) => new Date(a.due_date) - new Date(b.due_date));
  }

  // Data export/import functionality
  exportData() {
    const data = {
      books: JSON.parse(localStorage.getItem('lms_books') || '[]'),
      members: JSON.parse(localStorage.getItem('lms_members') || '[]'),
      circulation: JSON.parse(localStorage.getItem('lms_circulation') || '[]'),
      next_ids: JSON.parse(localStorage.getItem('lms_next_ids') || '{}'),
      export_date: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lms_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    return { status: 'ok', message: 'Data exported successfully' };
  }

  importData(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          
          // Validate data structure
          if (!data.books || !data.members || !data.circulation) {
            resolve({ status: 'error', message: 'Invalid backup file format' });
            return;
          }
          
          // Import data
          localStorage.setItem('lms_books', JSON.stringify(data.books));
          localStorage.setItem('lms_members', JSON.stringify(data.members));
          localStorage.setItem('lms_circulation', JSON.stringify(data.circulation));
          localStorage.setItem('lms_next_ids', JSON.stringify(data.next_ids || { books: 1, members: 1, circulation: 1 }));
          
          resolve({ status: 'ok', message: 'Data imported successfully' });
        } catch (error) {
          resolve({ status: 'error', message: 'Error parsing backup file: ' + error.message });
        }
      };
      reader.readAsText(file);
    });
  }

  clearAllData() {
    localStorage.removeItem('lms_books');
    localStorage.removeItem('lms_members');
    localStorage.removeItem('lms_circulation');
    localStorage.removeItem('lms_next_ids');
    this.initializeData();
    return { status: 'ok', message: 'All data cleared and reset to sample data' };
  }
}

// Initialize data manager
const dataManager = new DataManager();

// API simulation using localStorage
const api = (action, data = {}, method = "POST") => {
  return new Promise((resolve) => {
    // Simulate async behavior
    setTimeout(async () => {
      let result;
      
      switch (action) {
        case 'getBooks':
          result = { status: 'ok', books: dataManager.getBooks(data.q) };
          break;
        case 'addBook':
          result = dataManager.addBook(data);
          break;
        case 'updateBook':
          result = dataManager.updateBook(data.id, data);
          break;
        case 'deleteBook':
          result = dataManager.deleteBook(data.id);
          break;
        case 'getMembers':
          result = { status: 'ok', members: dataManager.getMembers(data.q) };
          break;
        case 'addMember':
          result = dataManager.addMember(data);
          break;
        case 'updateMember':
          result = dataManager.updateMember(data.id, data);
          break;
        case 'deleteMember':
          result = dataManager.deleteMember(data.id);
          break;
        case 'issueBook':
          result = dataManager.issueBook(data.book_id, data.member_id, data.issue_date, data.due_date);
          break;
        case 'returnBook':
          result = dataManager.returnBook(data.issue_id, data.return_date);
          break;
        case 'recentIssues':
          result = { status: 'ok', issues: dataManager.getRecentIssues() };
          break;
        case 'overdue':
          result = { status: 'ok', overdue: dataManager.getOverdue() };
          break;
        case 'exportData':
          result = dataManager.exportData();
          break;
        case 'importData':
          result = await dataManager.importData(data.file);
          break;
        case 'clearData':
          result = dataManager.clearAllData();
          break;
        default:
          result = { status: 'error', message: 'Invalid action' };
      }
      
      resolve(result);
    }, 100); // Small delay to simulate network request
  });
};

let currentUser = null;

function showDashboard() {
  document.getElementById("dash").classList.remove("hidden");
  document.getElementById("userName").innerText =
    currentUser.fullname || currentUser.username;
  document.getElementById("userRole").innerText = currentUser.role;
  applyRolePermissions(currentUser.role);

  // Populate account details if the elements exist
  const accountName = document.getElementById("accountName");
  if (accountName) accountName.innerText = currentUser.fullname;
  const accountUsername = document.getElementById("accountUsername");
  if (accountUsername) accountUsername.innerText = currentUser.username;
  const accountRole = document.getElementById("accountRole");
  if (accountRole) accountRole.innerText = currentUser.role;
  const accountEmail = document.getElementById("accountEmail");
  if (accountEmail && currentUser.email) accountEmail.innerText = currentUser.email;
  const accountMemberId = document.getElementById("accountMemberId");
  if (accountMemberId && currentUser.memberId) accountMemberId.innerText = currentUser.memberId;

  // Default landing page after login
  if (currentUser.role === 'admin') {
    setActiveDashboardPage("page-members");
    loadMembers();
  } else if (currentUser.role === 'faculty') {
    setActiveDashboardPage("page-books");
  }
  
  // Initial data loads for admin/member
  loadBooks();
  populateIssueSelectors();
  loadRecentIssues();
}

// Student Dashboard Functions
function showStudentDashboard() {
  document.getElementById("student-dash").classList.remove("hidden");
  
  // Update student info
  document.getElementById("studentName").innerText = currentUser.fullname;
  document.getElementById("studentId").innerText = currentUser.studentId;
  document.getElementById("accountName").innerText = currentUser.fullname;
  document.getElementById("accountId").innerText = currentUser.studentId;
  document.getElementById("accountEmail").innerText = currentUser.email;
  document.getElementById("accountDept").innerText = currentUser.department;
  
  // Load initial data
  loadStudentBooks();
  loadStudentBorrowedBooks();
  
  document.getElementById("studentBookSearch").addEventListener("keyup", (e) => {
    if (e.key === "Enter") searchStudentBooks();
  });
}

function showStudentBooks() {
  hideAllStudentSections();
  const section = document.getElementById("student-books");
  section.classList.remove("hidden");
  section.scrollIntoView({ behavior: 'smooth' });
}

function showStudentAccount() {
  hideAllStudentSections();
  const section = document.getElementById("student-account");
  section.classList.remove("hidden");
  section.scrollIntoView({ behavior: 'smooth' });
}

function showStudentBorrowed() {
  hideAllStudentSections();
  const section = document.getElementById("student-borrowed");
  section.classList.remove("hidden");
  loadStudentBorrowedBooks();
  section.scrollIntoView({ behavior: 'smooth' });
}

function hideAllStudentSections() {
  document.getElementById("student-books").classList.add("hidden");
  document.getElementById("student-account").classList.add("hidden");
  document.getElementById("student-borrowed").classList.add("hidden");
  document.getElementById("library-card").classList.add("hidden");
  document.getElementById("book-request").classList.add("hidden");
}

async function loadStudentBooks() {
  const res = await api("getBooks", { q: "" }, "GET");
  displayStudentBooks(res.books);
}

async function searchStudentBooks() {
  const query = document.getElementById("studentBookSearch").value.trim();
  const res = await api("getBooks", { q: query }, "GET");
  displayStudentBooks(res.books);
}

function displayStudentBooks(books) {
  const container = document.getElementById("studentBooksList");
  container.innerHTML = "";
  
  if (books.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: #6b7280; padding: 40px;">No books found</p>';
    return;
  }
  
  books.forEach(book => {
    const bookCard = document.createElement("div");
    bookCard.className = "book-card";
    
    const isAvailable = book.available_qty > 0;
    const availabilityClass = isAvailable ? "available" : "unavailable";
    const availabilityText = isAvailable ? "Available" : "Not Available";
    
    bookCard.innerHTML = `
      <h4>${escapeHtml(book.title)}</h4>
      <div class="book-author">by ${escapeHtml(book.author || "Unknown Author")}</div>
      <div class="book-details">
        <div>ISBN: ${escapeHtml(book.isbn || "N/A")}</div>
        <div>Subject: ${escapeHtml(book.subject || "N/A")}</div>
        <div>Year: ${book.year || "N/A"}</div>
        <div>Available: ${book.available_qty}/${book.total_qty}</div>
      </div>
      <span class="book-availability ${availabilityClass}">${availabilityText}</span>
    `;
    
    container.appendChild(bookCard);
  });
}

async function loadStudentBorrowedBooks() {
  // For demo purposes, we'll show some sample borrowed books
  const sampleBorrowedBooks = [
    {
      title: "Effective Java",
      author: "Joshua Bloch",
      issueDate: "2024-01-15",
      dueDate: "2024-02-15",
      status: "issued"
    },
    {
      title: "Clean Code",
      author: "Robert C. Martin", 
      issueDate: "2024-01-20",
      dueDate: "2024-02-20",
      status: "issued"
    }
  ];
  
  displayStudentBorrowedBooks(sampleBorrowedBooks);
}

function displayStudentBorrowedBooks(books) {
  const container = document.getElementById("studentBorrowedList");
  container.innerHTML = "";
  
  if (books.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: #6b7280; padding: 40px;">No books currently borrowed</p>';
    return;
  }
  
  books.forEach(book => {
    const today = new Date();
    const dueDate = new Date(book.dueDate);
    const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
    
    let dueClass = "due-normal";
    let dueText = `Due: ${book.dueDate}`;
    
    if (daysUntilDue < 0) {
      dueClass = "overdue";
      dueText = `Overdue by ${Math.abs(daysUntilDue)} days`;
    } else if (daysUntilDue <= 3) {
      dueClass = "due-soon";
      dueText = `Due in ${daysUntilDue} days`;
    }
    
    const borrowedItem = document.createElement("div");
    borrowedItem.className = "borrowed-item";
    borrowedItem.innerHTML = `
      <h4>${escapeHtml(book.title)}</h4>
      <div class="borrow-details">
        <div>Author: ${escapeHtml(book.author)}</div>
        <div>Borrowed: ${book.issueDate}</div>
      </div>
      <span class="due-date ${dueClass}">${dueText}</span>
    `;
    
    container.appendChild(borrowedItem);
  });
  
  // Update borrowed count in account
  document.getElementById("accountBorrowed").innerText = books.length;
}

async function loadBooks() {
  const q = document.getElementById("bookSearch").value.trim();
  const res = await api("getBooks", { q }, "GET");
  const out = document.getElementById("booksList");
  out.innerHTML = "";
  if (res.status !== "ok") {
    out.innerText = "Error loading";
    return;
  }
  res.books.forEach((b) => {
    const div = document.createElement("div");
    div.className = "list-item";
    div.innerHTML = `<div>
        <strong>${escapeHtml(b.title)}</strong><div class="muted">${escapeHtml(
      b.author
    )} • ${escapeHtml(b.accession_no)} • Avail: ${b.available_qty}/${
      b.total_qty
    }</div>
      </div>
      <div>
        <button onclick="openEditBook(${b.id})" class="secondary">Edit</button>
        <button onclick="deleteBook(${b.id})">Delete</button>
      </div>`;
    out.appendChild(div);
  });
  // also refresh issue select
  populateIssueSelectors();
}

async function loadMembers() {
  const q = document.getElementById("memberSearch").value.trim();
  const res = await api("getMembers", { q }, "GET");
  const out = document.getElementById("membersList");
  out.innerHTML = "";
  if (res.status !== "ok") {
    out.innerText = "Error loading";
    return;
  }
  const isAdmin = currentUser && currentUser.role === 'admin';
  res.members.forEach((m) => {
    const div = document.createElement("div");
    div.className = "list-item";
    let buttons = '';
    if (isAdmin) {
        buttons = `
        <div>
            <button onclick="showMemberDetails(${m.id})" class="secondary">Details</button>
            <button onclick="openEditMember(${m.id})" class="secondary">Edit</button>
            <button onclick="deleteMember(${m.id})">Delete</button>
        </div>`;
    }
    const roleText = m.role ? ` • ${m.role.charAt(0).toUpperCase() + m.role.slice(1)}` : '';
    div.innerHTML = `<div><strong>${escapeHtml(
      m.name
    )}</strong><div class="muted">${escapeHtml(m.member_code)} • ${escapeHtml(m.department || 'N/A')}${escapeHtml(roleText)}</div></div>${buttons}`;
    out.appendChild(div);
  });
  populateIssueSelectors();
}

async function showMemberDetails(id) {
  const res = await api("getMembers", { q: "" }, "GET");
  const member = res.members.find((m) => m.id == id);
  if (!member) return showNotification("Member not found", "error");

  const circulationRes = await api("recentIssues", {}, "GET");
  const memberIssues = circulationRes.issues.filter(issue => issue.member_id == id);

  let issuesHtml = '<h5>No book history</h5>';
  if (memberIssues.length > 0) {
    issuesHtml = `
      <h5>Book History</h5>
      <div class="details-list">
        ${memberIssues.map(issue => `
          <div class="details-list-item">
            <strong>${escapeHtml(issue.title)}</strong>
            <div class="muted">
              Issued: ${issue.issue_date} | 
              Status: ${issue.status}
              ${issue.status === 'returned' ? `| Returned: ${issue.return_date}` : `| Due: ${issue.due_date}`}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  const roleText = member.role ? member.role.charAt(0).toUpperCase() + member.role.slice(1) : 'N/A';
  const detailsHtml = `
    <div class="details-view">
      <div class="details-item"><label>Name:</label> <span>${escapeHtml(member.name)}</span></div>
      <div class="details-item"><label>Member Code:</label> <span>${escapeHtml(member.member_code)}</span></div>
      <div class="details-item"><label>Type:</label> <span>${escapeHtml(roleText)}</span></div>
      <div class="details-item"><label>Department:</label> <span>${escapeHtml(member.department || 'N/A')}</span></div>
      <div class="details-item"><label>Email:</label> <span>${escapeHtml(member.email || 'N/A')}</span></div>
      <div class="details-item"><label>Phone:</label> <span>${escapeHtml(member.phone || 'N/A')}</span></div>
      <hr>
      ${issuesHtml}
    </div>
  `;

  showModal('Member Details', detailsHtml); // No onSave callback for view-only
}

function showAddBookModal() {
  const formHtml = `
    <form id="modalForm" class="modal-form">
      <input type="text" name="accession_no" placeholder="Accession Number" required>
      <input type="text" name="title" placeholder="Book Title" required>
      <input type="text" name="author" placeholder="Author">
      <input type="text" name="isbn" placeholder="ISBN">
      <input type="text" name="publisher" placeholder="Publisher">
      <input type="number" name="year" placeholder="Year">
      <input type="number" name="total_qty" placeholder="Total Quantity" value="1" required>
      <input type="number" name="available_qty" placeholder="Available Quantity" value="1" required>
      <input type="text" name="subject" placeholder="Subject">
    </form>
  `;
  
  showModal('Add New Book', formHtml, (data) => {
    const bookData = {
      ...data,
      year: data.year ? parseInt(data.year) : null,
      total_qty: parseInt(data.total_qty) || 1,
      available_qty: parseInt(data.available_qty) || 1,
    };
    
    api("addBook", bookData).then(res => {
      if (res.status === "ok") {
        loadBooks();
        showNotification("Book added successfully", "success");
      } else {
        showNotification("Error adding book: " + res.message, "error");
      }
    });
  });
}

function showAddMemberModal() {
  const formHtml = `
    <form id="modalForm" class="modal-form">
      <input type="text" name="member_code" placeholder="Member Code" required>
      <input type="text" name="name" placeholder="Full Name" required>
      <select name="role" required>
        <option value="" disabled selected>Select Type</option>
        <option value="student">Student</option>
        <option value="faculty">Faculty</option>
      </select>
      <input type="text" name="department" placeholder="Department">
      <input type="text" name="email" placeholder="Email">
      <input type="text" name="phone" placeholder="Phone">
    </form>
  `;

  showModal('Add New Member', formHtml, (data) => {
    api("addMember", data).then(res => {
      if (res.status === "ok") {
        loadMembers();
        showNotification("Member added successfully", "success");
      } else {
        showNotification("Error adding member: " + res.message, "error");
      }
    });
  });
}

async function openEditMember(id) {
  const res = await api("getMembers", { q: "" }, "GET");
  const member = res.members.find((m) => m.id == id);
  if (!member) return showNotification("Member not found", "error");

  const formHtml = `
    <form id="modalForm" class="modal-form">
      <input type="text" name="member_code" placeholder="Member Code" value="${escapeHtml(member.member_code)}" required>
      <input type="text" name="name" placeholder="Full Name" value="${escapeHtml(member.name)}" required>
      <select name="role" required>
        <option value="student" ${member.role === 'student' ? 'selected' : ''}>Student</option>
        <option value="faculty" ${member.role === 'faculty' ? 'selected' : ''}>Faculty</option>
      </select>
      <input type="text" name="department" placeholder="Department" value="${escapeHtml(member.department || '')}">
      <input type="text" name="email" placeholder="Email" value="${escapeHtml(member.email || '')}">
      <input type="text" name="phone" placeholder="Phone" value="${escapeHtml(member.phone || '')}">
    </form>
  `;

  showModal('Edit Member', formHtml, (data) => {
    const memberData = {
      id: member.id,
      ...data,
    };
    
    api("updateMember", memberData).then(updateRes => {
      if (updateRes.status === "ok") {
        loadMembers();
        showNotification("Member updated successfully", "success");
      } else {
        showNotification("Error updating member: " + updateRes.message, "error");
      }
    });
  });
}

async function openEditBook(id) {
  // load book details by search
  const res = await api("getBooks", { q: "" }, "GET");
  const book = res.books.find((b) => b.id == id);
  if (!book) return showNotification("Book not found", "error");

  const formHtml = `
    <form id="modalForm" class="modal-form">
      <input type="text" name="accession_no" placeholder="Accession Number" value="${escapeHtml(book.accession_no)}" required>
      <input type="text" name="title" placeholder="Book Title" value="${escapeHtml(book.title)}" required>
      <input type="text" name="author" placeholder="Author" value="${escapeHtml(book.author || '')}">
      <input type="text" name="isbn" placeholder="ISBN" value="${escapeHtml(book.isbn || '')}">
      <input type="text" name="publisher" placeholder="Publisher" value="${escapeHtml(book.publisher || '')}">
      <input type="number" name="year" placeholder="Year" value="${book.year || ''}">
      <input type="number" name="total_qty" placeholder="Total Quantity" value="${book.total_qty}" required>
      <input type="number" name="available_qty" placeholder="Available Quantity" value="${book.available_qty}" required>
      <input type="text" name="subject" placeholder="Subject" value="${escapeHtml(book.subject || '')}">
    </form>
  `;

  showModal('Edit Book', formHtml, (data) => {
    const bookData = {
      id: book.id,
      ...data,
      year: data.year ? parseInt(data.year) : null,
      total_qty: parseInt(data.total_qty) || book.total_qty,
      available_qty: parseInt(data.available_qty) || book.available_qty,
    };
    
    api("updateBook", bookData).then(updateRes => {
      if (updateRes.status === "ok") {
        loadBooks();
        showNotification("Book updated successfully", "success");
      } else {
        showNotification("Error updating book: " + updateRes.message, "error");
      }
    });
  });
}

async function deleteBook(id) {
    const bodyHtml = `<p>Are you sure you want to delete this book? This action cannot be undone.</p>`;
    showModal('Confirm Deletion', bodyHtml, async () => {
        const res = await api("deleteBook", { id });
        if (res.status === "ok") {
            loadBooks();
            showNotification("Book deleted successfully", "success");
        } else {
            showNotification("Error deleting book: " + res.message, "error");
        }
    }, 'Delete');
}

async function deleteMember(id) {
    const bodyHtml = `<p>Are you sure you want to delete this member? This action cannot be undone.</p>`;
    showModal('Confirm Deletion', bodyHtml, async () => {
        const res = await api("deleteMember", { id });
        if (res.status === "ok") {
            loadMembers();
            showNotification("Member deleted successfully", "success");
        } else {
            showNotification("Error deleting member: " + res.message, "error");
        }
    }, 'Delete');
}

async function populateIssueSelectors() {
  const booksRes = await api("getBooks", { q: "" }, "GET");
  const membersRes = await api("getMembers", { q: "" }, "GET");
  const bookSel = document.getElementById("issueBookSelect");
  const memSel = document.getElementById("issueMemberSelect");
  bookSel.innerHTML = '<option value="">Select Book</option>';
  memSel.innerHTML = '<option value="">Select Member</option>';
  booksRes.books.forEach((b) => {
    if (b.available_qty > 0)
      bookSel.innerHTML += `<option value="${b.id}">${escapeHtml(b.title)} (${
        b.accession_no
      }) - Avail ${b.available_qty}</option>`;
  });
  membersRes.members.forEach(
    (m) =>
      (memSel.innerHTML += `<option value="${m.id}">${escapeHtml(m.name)} (${
        m.member_code
      })</option>`)
  );
}

async function issueBook() {
  const book_id = document.getElementById("issueBookSelect").value;
  const member_id = document.getElementById("issueMemberSelect").value;
  const issue_date =
    document.getElementById("issueDate").value ||
    new Date().toISOString().slice(0, 10);
  const due_date = document.getElementById("dueDate").value;
  if (!book_id || !member_id || !due_date)
    return showNotification("Please select book, member, and due date", "error");
  const res = await api("issueBook", {
    book_id,
    member_id,
    issue_date,
    due_date,
  });
  if (res.status === "ok") {
    showNotification("Book issued successfully", "success");
    loadBooks();
    loadRecentIssues();
  } else showNotification(res.msg || "Error issuing book", "error");
}

async function loadRecentIssues() {
  const res = await api("recentIssues", {}, "GET");
  const out = document.getElementById("recentIssues");
  out.innerHTML = "";
  if (res.status !== "ok") return;
  res.issues.forEach((i) => {
    const div = document.createElement("div");
    div.className = "list-item";
    div.innerHTML = `<div><strong>${escapeHtml(
      i.title || "Book"
    )}</strong><div class="muted">${escapeHtml(i.name)} • Issued: ${ 
      i.issue_date
    } • Due: ${i.due_date} • Status: ${i.status}</div></div>
        <div>${ 
          i.status === "issued"
            ? `<button onclick="promptReturn(${i.id})">Return</button>`
            : `<span class="muted">Returned</span>`
        }</div>`;
    out.appendChild(div);
  });
}

function promptReturn(issueId) {
  const today = new Date().toISOString().slice(0, 10);
  const formHtml = `
    <form id="modalForm" class="modal-form">
      <label for="return_date">Enter return date:</label>
      <input type="date" name="return_date" value="${today}" required>
    </form>
  `;
  
  showModal('Return Book', formHtml, (data) => {
    if (!data.return_date) return;
    
    api("returnBook", { issue_id: issueId, return_date: data.return_date }).then(res => {
      if (res.status === "ok") {
        showNotification(`Book returned successfully. Fine: $${res.fine.toFixed(2)}`, "success");
        loadBooks();
        loadRecentIssues();
      } else {
        showNotification(res.message || "Error returning book", "error");
      }
    });
  }, 'Return');
}

async function showOverdue() {
  const res = await api("overdue", {}, "GET");
  const out = document.getElementById("reportArea");
  out.innerHTML = "";
  if (res.status !== "ok") {
    out.innerText = "Error";
    return;
  }
  if (res.overdue.length === 0) {
    out.innerText = "No overdue; all good.";
    return;
  }
  res.overdue.forEach((o) => {
    const div = document.createElement("div");
    div.className = "list-item";
    div.innerHTML = `<div><strong>${escapeHtml(o.title)} (${escapeHtml(
      o.name
    )})</strong><div class="muted">Due: ${o.due_date} • Days overdue: ${ 
      o.days_overdue
    }</div></div>`;
    out.appendChild(div);
  });
}

/* Modal System */
function showModal(title, bodyHtml, onSave, saveBtnText = 'Save') {
  document.getElementById('modalTitle').innerText = title;
  document.getElementById('modalBody').innerHTML = bodyHtml;

  const modal = document.getElementById('customModal');
  modal.classList.remove('hidden');

  const saveBtn = document.getElementById('modalSaveBtn');
  const cancelBtn = document.getElementById('modalCancelBtn');
  const form = document.getElementById('modalForm');

  // Clone and replace to clear previous listeners
  const newSaveBtn = saveBtn.cloneNode(true);
  saveBtn.parentNode.replaceChild(newSaveBtn, saveBtn);

  if (onSave) {
    newSaveBtn.style.display = '';
    cancelBtn.innerText = 'Cancel';
    newSaveBtn.innerText = saveBtnText;

    newSaveBtn.onclick = () => {
      // If a form exists, check its validity before proceeding
      if (form && !form.checkValidity()) {
        form.reportValidity(); // Show browser's validation messages
        return;
      }

      const data = form ? Object.fromEntries(new FormData(form).entries()) : {};
      onSave(data);
      hideModal();
    };
  } else {
    // View-only modal
    newSaveBtn.style.display = 'none';
    cancelBtn.innerText = 'Close';
  }
}

function hideModal() {
  const modal = document.getElementById('customModal');
  if (modal) {
    modal.classList.add('hidden');
    document.getElementById('modalBody').innerHTML = ''; // Clear body
    // Reset button states
    document.getElementById('modalSaveBtn').style.display = '';
    document.getElementById('modalCancelBtn').innerText = 'Cancel';
  }
}

function setupModal() {
    document.getElementById('modalCloseBtn').addEventListener('click', hideModal);
    document.getElementById('modalCancelBtn').addEventListener('click', hideModal);
    // Also close on overlay click
    document.getElementById('customModal').addEventListener('click', (e) => {
        if (e.target.id === 'customModal') {
            hideModal();
        }
    });
}

/* Helpers */
function escapeHtml(s = "") {
  return String(s).replace(
    /[&<>\"]/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])
  );
}

/* Dashboard navigation and role permissions */
function setupDashboardNavigation() {
  // Navigation is now handled by onclick attributes in the HTML
  // Keep the cross-page navigation buttons
  const toBooks = document.getElementById("toBooks");
  const toCirc = document.getElementById("toCirculation");
  const toBooksFromFinal = document.getElementById("toBooksFromFinal");
  if (toBooks)
    toBooks.addEventListener("click", () => setActiveDashboardPage("page-books"));
  if (toCirc)
    toCirc.addEventListener("click", () => setActiveDashboardPage("page-circulation"));
  if (toBooksFromFinal)
    toBooksFromFinal.addEventListener("click", () => setActiveDashboardPage("page-books"));
}

function setActiveDashboardPage(sectionId) {
  const pages = ["page-members", "page-books", "page-circulation", "page-account"];
  pages.forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (id === sectionId) {
      el.classList.remove("hidden");
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      el.classList.add("hidden");
    }
  });
  
  // Active nav state for cards
  const navMap = {
    "page-members": "navMembers",
    "page-books": "navBooks",
    "page-circulation": "navCirculation",
    "page-account": "navAccount",
  };
  
  // Remove active class from all cards
  Object.values(navMap).forEach((btnId) => {
    const btn = document.getElementById(btnId);
    if (btn) btn.classList.remove("active");
  });
  
  // Add active class to selected card
  const activeBtnId = navMap[sectionId];
  const activeBtn = document.getElementById(activeBtnId);
  if (activeBtn) activeBtn.classList.add("active");
}

function applyRolePermissions(role) {
  const isAdmin = role && role.toLowerCase() === "admin";
  const isFaculty = role && role.toLowerCase() === "faculty";
  const isStudent = role && role.toLowerCase() === "student";

  // Show/hide navigation cards based on role
  const navMembers = document.getElementById("navMembers");
  const navBooks = document.getElementById("navBooks");
  const navCirculation = document.getElementById("navCirculation");

  // Students can only see books
  if (isStudent) {
    if (navMembers) navMembers.style.display = "none";
    if (navCirculation) navCirculation.style.display = "none";
    if (navBooks) navBooks.style.display = "";
    // Set books as default page for students
    setActiveDashboardPage("page-books");
  } else {
    // Admin sees all, member sees a subset
    if (isAdmin) {
        if (navMembers) navMembers.style.display = "";
    } else if (isFaculty) {
        if (navMembers) navMembers.style.display = "none";
    }
    if (navBooks) navBooks.style.display = "";
    if (navCirculation) navCirculation.style.display = "";
  }

  // Control page visibility
  const pageMembers = document.getElementById("page-members");
  const pageBooks = document.getElementById("page-books");
  const pageCirculation = document.getElementById("page-circulation");

  if (isStudent) {
    if (pageMembers) pageMembers.classList.add("hidden");
    if (pageCirculation) pageCirculation.classList.add("hidden");
    if (pageBooks) pageBooks.classList.remove("hidden");
  } else {
    if (pageMembers) pageMembers.classList.remove("hidden");
    if (pageBooks) pageBooks.classList.remove("hidden");
    if (pageCirculation) pageCirculation.classList.remove("hidden");
  }

  // Control button visibility
  const btnAddBook = document.getElementById("btnAddBook");
  const btnAddMember = document.getElementById("btnAddMember");
  const btnIssue = document.getElementById("btnIssue");

  if (isStudent) {
    // Students can only view books, no add/edit/issue buttons
    if (btnAddBook) btnAddBook.style.display = "none";
    if (btnAddMember) btnAddMember.style.display = "none";
    if (btnIssue) btnIssue.style.display = "none";
  } else if (isFaculty) {
    // Members can manage books and circulation, but not members
    if (btnAddBook) btnAddBook.style.display = "";
    if (btnAddMember) btnAddMember.style.display = "none";
    if (btnIssue) btnIssue.style.display = "";
  } else if (isAdmin) {
    // Admins can do everything
    if (btnAddBook) btnAddBook.style.display = "";
    if (btnAddMember) btnAddMember.style.display = "";
    if (btnIssue) btnIssue.style.display = "";
  }
}

/* Notification System */
function showNotification(message, type = "info") {
  // Remove existing notifications
  const existing = document.querySelectorAll('.notification');
  existing.forEach(n => n.remove());
  
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <span class="notification-message">${message}</span>
      <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove();
    }
  }, 5000);
}


/* Data Management Functions */
async function exportData() {
  try {
    const result = await api('exportData');
    if (result.status === 'ok') {
      showNotification('Data exported successfully!', 'success');
    } else {
      showNotification('Error exporting data: ' + result.message, 'error');
    }
  } catch (error) {
    showNotification('Error exporting data: ' + error.message, 'error');
  }
}

// Handle file import
document.getElementById('importFileInput').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  
  try {
    const result = await api('importData', { file });
    if (result.status === 'ok') {
      showNotification('Data imported successfully!', 'success');
      // Refresh all data
      loadBooks();
      loadMembers();
      loadRecentIssues();
      populateIssueSelectors();
    } else {
      showNotification('Error importing data: ' + result.message, 'error');
    }
  } catch (error) {
    showNotification('Error importing data: ' + error.message, 'error');
  }
  
  // Clear the file input
  e.target.value = '';
});

async function clearAllData() {
  if (confirm('Are you sure you want to clear all data? This will reset the system to sample data and cannot be undone.')) {
    try {
      const result = await api('clearData');
      if (result.status === 'ok') {
        showNotification('All data cleared and reset to sample data', 'success');
        // Refresh all data
        loadBooks();
        loadMembers();
        loadRecentIssues();
        populateIssueSelectors();
      } else {
        showNotification('Error clearing data: ' + result.message, 'error');
      }
    } catch (error) {
      showNotification('Error clearing data: ' + error.message, 'error');
    }
  }
}

function showPopup(message) {
    document.getElementById("popupMessage").textContent = message;
    document.getElementById("customPopup").style.display = "flex";
}

function hidePopup() {
    document.getElementById("customPopup").style.display = "none";
}