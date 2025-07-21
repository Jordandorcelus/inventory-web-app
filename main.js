const bookList = document.querySelector(".book-list");
const newBookForm = document.getElementById("new_book");
// const li = document.createElement("li");
// li.textContent = "Book Four";
// ul.appendChild(li);


// Load from localStorage on page load
window.addEventListener("DOMContentLoaded", () => {
    const savedBooks = JSON.parse(localStorage.getItem("books")) || [];
    savedBooks.forEach(book => addNewBook(book));
});

const deleteBtns = document.querySelectorAll('.delete-btn');
deleteBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const li = e.target.closest('li');
        li.remove();
    })
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
        <span  class="stock ${inStock === "true" ? "in" : "out"}">
            ${inStock === "true" ? "In Stock" : "Out Of Stock"}
            </span>
        <p class="book-price">$${parseFloat(price).toFixed(2)}</p>
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

    // Append New Book to Book-list
    bookList.appendChild(li);
}

// Delete from localStorage by title (assumes titles are unique)
function deleteBookFromStorage(title) {
    let books = JSON.parse(localStorage.getItem("books")) || [];
    books = books.filter(book => book.title !== title);
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

    // Save to LocalStorage
    const books = JSON.parse(localStorage.getItem("books")) || [];
    books.push(newBook);
    localStorage.setItem("books", JSON.stringify(books));
   

    // Add To Dom
   addNewBook(newBook);


    // Reset the Form
    e.target.reset();
});
