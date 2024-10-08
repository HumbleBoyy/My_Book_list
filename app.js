// Book class: Represents a Book
class Book {
    constructor(title, author, isbn){
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}


// UI Class: Handle UI Tasks
class UI {
    static displayBooks(){
       
        const books = Store.getBooks();

        books.forEach((book)=> UI.addBookToList(book));
    }

    static addBookToList(book){
       const list = document.querySelector('#book-list');

       const row = document.createElement('tr');

       row.innerHTML = `
         <td>${book.title}</td>
         <td>${book.author}</td>
         <td>${book.isbn}</td>
         <td><a href="#" class="btn btn-danger btn-sm delete">Delete</a></td>
       `;

       list.appendChild(row)
    }

    static deleteBook(target){
         if(target.classList.contains('delete')){
            target.parentElement.parentElement.remove();
         }
    }

    static showAlert(message, className){
       const div = document.createElement('div');
       div.className = `alert alert-${className}`;
       div.appendChild(document.createTextNode(message));

       const container = document.querySelector('.container');
       const form = document.querySelector('#book-form');
       container.insertBefore(div, form);

            // Vanisg in 3 seconds

            setTimeout(()=> document.querySelector('.alert').remove(),3000)
    }

    static clearFields(){
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }
}

// Store Class: Handles Storage
class Store {
    static getBooks(){
        let books;

        if(localStorage.getItem('books') === null){
           books = [];
        }else{
            books  = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }
   static addBook(book){
        const books = Store.getBooks();

        books.push(book)

        localStorage.setItem('books', JSON.stringify(books));
    }
   static remove(isbn){
        const books = Store.getBooks();

        books.forEach((book, index)=> {
            if(book.isbn === isbn){
               books.splice(index,1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}

// Event Display Books
document.addEventListener('DOMContentLoaded', UI.displayBooks)

// Event: Add a Book
document.querySelector('#book-form').addEventListener('submit', (e)=>{

    e.preventDefault()
    // Get form values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    // Validate
     if(title === '' || author === '' || isbn === ''){
        UI.showAlert('Please fill all the fields', 'danger');
     }else{
             // Instantiate boook
             const book = new Book(title, author, isbn);

            //  Show success message
              UI.showAlert('Book added successfully', 'success');
    
              // Add a Book to UI
              UI.addBookToList(book);

            //   Add book to store
            Store.addBook(book);

              // Clear fields
              UI.clearFields();
     }


});


// Event: Remove a Book
document.querySelector('#book-list').addEventListener('click', (e)=> {
       
        UI.deleteBook(e.target);

       //Remove book from from store
       Store.remove(e.target.parentElement.previousElementSibling.textContent);


       //  Show success message
       UI.showAlert('Book removed successfully', 'success');
});