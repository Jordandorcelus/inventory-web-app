const sortSelect = document.getElementById("sort");
const filterSelect = document.getElementById("filter");
const bookList = document.querySelector(".book-list");
const newBookForm = document.getElementById("new_book");
const cancelEditBtn = document.getElementById("cancel-edit");
const submitBtn = document.getElementById("submit-btn");


// Load from localStorage on page load
window.addEventListener("DOMContentLoaded", () => {
    const savedbooks = JSON.parse(localStorage.getItem("books"));

    // If no books saved yet, pull from hardcoded DOM
    if (!savedbooks || savedbooks.length === 0) {
        const hardcodedBooks = Array.from(document.querySelectorAll(".first-book")).map(li => {
            return {
            title: li.querySelector(".book-title")?.textContent.trim(),
            author: li.querySelector(".author-name")?.textContent.trim(),
            imageUrl: li.querySelector("img")?.getAttribute("src"),
            price: li.querySelector(".book-price")?.textContent.replace("$", "").trim(),
            inStock: li.querySelector(".stock")?.textContent.trim() === "In Stock" ? "true" : "false"
            };
           
            // return { title, author, imageUrl, price, inStock };
        });

        // Save hardcoded books to localStorage
        localStorage.setItem("books", JSON.stringify(hardcodedBooks));
        // books = hardcodedBooks;
    }

    // Now render all books from localStorage
    renderBooks();
});

function addNewBook(book) {
    const { title, author, imageUrl, price, inStock } = book;

    // Construct URL's
    const bookSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(title)}+book`;
    const authorWikiUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(author.replace(/\s+/g, "_"))}`;

    // Create New Book Details
    const li = document.createElement("li");
    li.classList.add("first-book");
    
    li.innerHTML = `
    <a  href="${bookSearchUrl}"  target="_blank">
        <img  src="${imageUrl}"  alt="Image Cover of ${title}"  class="first-img">
    </a>
    <div  class="first-details">
        <a  href="${bookSearchUrl}"  target="_blank"  class="book-title-link">
            <h3  class="book-title">${title}</h3>
        </a>
        <a  href="${authorWikiUrl}"  target="_blank"  class="author-name-link">
            <p  class="author-name">${author}</p>
        </a>
        <span class="stock ${inStock === "true" ? "in" : "out"}" data-title="${title}">
            ${inStock === "true" ? "In Stock" : "Out Of Stock"}
            </span>
        <p class="book-price">$${parseFloat(price).toFixed(2)}</p>
    </div>
    <div  class="edit-wrap">
        <button class="edit-btn">Edit</button>
    </div>
    <div  class="delete-wrap">
        <button  class="delete-btn">🗑️</button>
    </div>
    `;
    // Add Delete Functionality
    const deleteBtn = li.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", () => {
        li.remove();
        deleteBookFromStorage(title);
    });

    // Edit Existing Book
    const EditBtn = li.querySelector(".edit-btn");
    EditBtn.addEventListener('click', () => {
        populateFormEdit(book)
    });

    // make each book toggle its stock status
    const stockSpan = li.querySelector(".stock");
    stockSpan.addEventListener("click", () => {
        const isInStock = stockSpan.textContent.trim() === "In Stock";
        stockSpan.textContent = isInStock ? "Out Of Stock" : "In Stock";
        stockSpan.classList.toggle("in", !isInStock);
        stockSpan.classList.toggle("out", isInStock);

    // Update localStorage
    let books = JSON.parse(localStorage.getItem("books")) || [];
    books = books.map(b => {
        if (b.title.toLowerCase() === title.toLowerCase()) {
            return { ...b, inStock: (!isInStock).toString() };
        }
        return b;
    });
    localStorage.setItem("books", JSON.stringify(books));

    // Refresh view
    renderBooks();
});

    

    // Append New Book to Book-list
    bookList.appendChild(li);
}

// Main FUnction To Re-Render
function renderBooks() {
    let books = JSON.parse(localStorage.getItem("books")) || [];

    // Apply Filter
    const filter = filterSelect.value;
    if (filter === "in") {
        books = books.filter(book => book.inStock === "true");
    } else if (filter === "out") {
        books = books.filter(book => book.inStock === "false");
    }

    // Apply Sort
    const sort = sortSelect.value;
    if (sort === "title-asc") {
        books.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sort === "title-desc") {
        books = books.sort((a, b) => b.title.localeCompare(a.title));
        } else if (sort === "price-asc") {
            books.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        } else if (sort === "price-desc") {
            books.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        }

        // Clear and Re-Render
        bookList.innerHTML = "";
        books.forEach(book => addNewBook(book));
}

// Trigger Render When Changes, Add Event Listener change
sortSelect.addEventListener("change", renderBooks);
filterSelect.addEventListener("change", renderBooks);


// Tracking Edit state
let bookIsEditing = null;

function populateFormEdit(book) {
    document.getElementById("title").value = book.title;
    document.getElementById("author").value = book.author;
    document.getElementById("image_url").value = book.imageUrl;
    document.getElementById("price").value = book.price;
    document.getElementById("instock").value = book.inStock;

    bookIsEditing = book;

    cancelEditBtn.style.display = "inline-block";
    submitBtn.textContent = "Save Changes";
}

// Add Cancel Button Handler
cancelEditBtn.addEventListener('click', () => {
    newBookForm.reset();
    bookIsEditing = null;
    cancelEditBtn.style.display = "none";
    submitBtn.textContent = "Add Book";
})

// Delete from localStorage by title (assumes titles are unique)
function deleteBookFromStorage(title) {
    let books = JSON.parse(localStorage.getItem("books")) || [];
    books = books.filter(book => book.title.toLowerCase() !== title.toLowerCase());
    localStorage.setItem("books", JSON.stringify(books));
}
// Handle Form Submission
newBookForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get All Forms Values
    const title = document.getElementById("title").value.trim();
    const author = document.getElementById("author").value.trim();
    const imageUrl = document.getElementById("image_url").value.trim();
    const price = document.getElementById("price").value.trim();
    const inStock = document.getElementById("instock").value.trim();

    if (!title || !author || !imageUrl || !price || !inStock) {
        alert("Please fill out all the feilds!");
        return;
    }

    const newBook = { title, author, imageUrl, price, inStock };
    let books = JSON.parse(localStorage.getItem("books")) || [];

    if (bookIsEditing) {
        // Remove Old Book While Editing
        // const oldBookRemoved = [...bookList.children].find(
        //     li => li.querySelector('.book-title')?.textContent === bookIsEditing.title
        // );
        // if (oldBookRemoved) oldBookRemoved.remove();

        // Editiing: Replace old book by title
        books = books.map(book => 
            book.title.toLowerCase() === bookIsEditing.title.toLowerCase() ? newBook : book);
        bookIsEditing = null;
    } else {
        // New Book
        books.push(newBook);
    }

    // Save to LocalStorage
    localStorage.setItem("books", JSON.stringify(books));
    newBookForm.reset();

    // Hide Button After Editing
    cancelEditBtn.style.display = "none";
    submitBtn.textContent = "Add Book";
   

    // re-render
   renderBooks();

});
