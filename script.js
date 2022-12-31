let myLibrary = [];

class Library {
    constructor() {
        this.books = [];
    }

    punctuationless(string){
        return string.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
        .replace(/\s{1,}/g, "")
        .toLowerCase();
    }

    bookExists(searchBook){
        return this.books.some((book) => {
            const bookString =  this.punctuationless(book.title);
            const searchString = this.punctuationless(searchBook.title);
            return bookString === searchString;
        });
    }

    addBook(bookToAdd){
        if(!this.bookExists(bookToAdd)){
            this.books.push(bookToAdd);
        }
    }

    removeBook(bookToRemove){

        this.books = this.books.filter((book) => 
        this.punctuationless(book.title) !== this.punctuationless(bookToRemove));
    }

    getBook(bookToGet){
        return this.books.find((book) => this.punctuationless(book.title) === this.punctuationless(bookToGet));
    }

}

class Book {
    constructor(title='unknown', author='unknown', pages=0, isRead=false) {
        this.title=title;
        this.author=author;
        this.pages=pages;
        this.isRead=isRead;
    }
}

const library = new Library();


const addBookBtn = document.getElementById('addBookBtn');
const addBookModal = document.getElementById('addBookModal');
const overlay = document.getElementById('overlay');
const addBookForm = document.getElementById('addBookForm');
const booksGrid = document.getElementById('booksGrid');
const errorMsg = document.getElementById('errorMsg');

const openAddBookModal = () => {
    addBookForm.reset();
    addBookModal.classList.add('active');
    overlay.classList.add('active');
}

const closeAddBookModal = () => {
    addBookModal.classList.remove('active');
    overlay.classList.remove('active');
    errorMsg.classList.remove('active');
    errorMsg.textContent = '';
}

const updateBooksGrid = () => {
    resetBooksGrid();
    for (let book of library.books) {
        createBookCard(book);
    }
}

const resetBooksGrid = () => {
    booksGrid.innerHTML = '';
}

const createBookCard = (book) => {
    const bookCard = document.createElement('div');
    const title = document.createElement('p');
    const author = document.createElement('p');
    const pages = document.createElement('p');
    const buttonGroup = document.createElement('div');
    const readBtn = document.createElement('button');
    const removeBtn = document.createElement('button');

    bookCard.classList.add('book-card');
    buttonGroup.classList.add('button-group');
    readBtn.classList.add('btn');
    removeBtn.classList.add('btn');
    readBtn.onclick = toggleRead;
    removeBtn.onclick = removeBook;

    title.textContent = `"${book.title}"`;
    author.textContent = book.author;
    pages.textContent = `${book.pages} pages`;
    removeBtn.textContent = 'Remove';

    if (book.isRead) {
        readBtn.textContent = 'Read';
        readBtn.classList.add('btn-light-green');
    } else {
        readBtn.textContent = 'Not read';
        readBtn.classList.add('btn-light-red');
    }

    bookCard.appendChild(title);
    bookCard.appendChild(author);
    bookCard.appendChild(pages);
    buttonGroup.appendChild(readBtn);
    buttonGroup.appendChild(removeBtn);
    bookCard.appendChild(buttonGroup);
    booksGrid.appendChild(bookCard);
}

const getBookFromInput = () => {
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const pages = document.getElementById('pages').value;
    const isRead = document.getElementById('isRead').checked;

    return new Book(title, author, pages, isRead);
}

const addBook = (e) => {
    e.preventDefault();
    const newBook = getBookFromInput();

    if (library.bookExists(newBook)) {
        errorMsg.textContent = 'Library already contains this book.';
        errorMsg.classList.add('active');
        return;
    }
    library.addBook(newBook);
    saveLocal();
    updateBooksGrid();
    closeAddBookModal();
}

const removeBook = (e) => {
    const bookToRemove = e.target.parentNode.parentNode.firstChild.innerHTML.split('"')[1];
    library.removeBook(bookToRemove);
    saveLocal();
    updateBooksGrid();
}

const toggleRead = (e) => {
    const book = e.target.parentNode.parentNode.firstChild.innerHTML.split('"')[1];
    const bookRead = library.getBook(book);

    bookRead.isRead = !bookRead.isRead;
    saveLocal();
    updateBooksGrid();
}

const saveLocal = () => {
    localStorage.setItem('library', JSON.stringify(library.books));
}

const restoreLocal = () => {
    const books = JSON.parse(localStorage.getItem('library'));
    if (books) {
        library.books = books.map((book) => JSONToBook(book));
    } else {
        library.books = [];
    }
}

const JSONToBook = (book) => {
    return new Book(book.title, book.author, book.pages, book.isRead);
}

addBookBtn.onclick = openAddBookModal;
overlay.onclick = closeAddBookModal;
addBookForm.onsubmit = addBook;










