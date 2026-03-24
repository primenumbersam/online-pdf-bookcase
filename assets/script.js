// script.js

// Bookshelf Logic
async function initBookshelf() {
    const shelf = document.getElementById('shelf');
    if (!shelf) return;

    try {
        const response = await fetch('books.json');
        const books = await response.json();

        books.forEach(book => {
            const bookEl = document.createElement('div');
            bookEl.className = 'book-wrapper';
            bookEl.innerHTML = `
                <div class="book">
                    <div class="book-front" style="background-image: url('${book.cover}')"></div>
                    <div class="book-back"></div>
                    <div class="book-spine">
                        <span style="writing-mode: vertical-rl; text-orientation: mixed;">${book.title}</span>
                    </div>
                    <div class="book-top"></div>
                    <div class="book-bottom"></div>
                    <div class="book-right"></div>
                </div>
                <div class="book-info">${book.title}</div>
            `;

            // Random spine color
            const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
            bookEl.querySelector('.book-spine').style.backgroundColor = randomColor;

            bookEl.addEventListener('click', () => {
                window.location.href = `viewer.html?book=${book.id}`;
            });

            shelf.appendChild(bookEl);
        });
    } catch (error) {
        console.error('Error loading books:', error);
    }
}

// Viewer Logic
let pageFlip;

async function initViewer() {
    const viewer = document.getElementById('book');
    if (!viewer) return;

    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get('book');

    if (!bookId) {
        alert('No book specified!');
        window.location.href = 'index.html';
        return;
    }

    try {
        const response = await fetch('books.json');
        const books = await response.json();
        const bookData = books.find(b => b.id === bookId);

        if (!bookData) {
            alert('Book not found!');
            return;
        }

        document.title = `${bookData.title} - Viewer`;

        // Load Pages
        // PageFlip requires pages to be in the DOM before initialization or added dynamically.
        // We will add them to the DOM first.

        // Use page-flip from global object (St.PageFlip) if available, or just PageFlip if imported via module.
        // Since we are using CDN script in HTML, it's likely 'St' namespace or global.
        // We'll assume the script is loaded via CDN as specified in spec.

        // Wait for images to be ready? No, page-flip handles it.

        for (let i = 1; i <= bookData.pages; i++) {
            const pageDiv = document.createElement('div');
            pageDiv.className = 'page';

            const img = document.createElement('img');
            img.src = `${bookData.folder}page-${String(i).padStart(2, '0')}.jpg`;
            img.loading = "lazy";

            pageDiv.appendChild(img);
            viewer.appendChild(pageDiv);
        }

        // Initialize PageFlip
        // Assuming 'PageFlip' is available globally from 'page-flip' library
        // Note: The library usually exports 'PageFlip' class.

        pageFlip = new St.PageFlip(viewer, {
            width: 550, // base page width
            height: 733, // base page height
            size: "stretch",
            // set threshold values:
            minWidth: 315,
            maxWidth: 1000,
            minHeight: 420,
            maxHeight: 1350,
            maxShadowOpacity: 0.5, // Half shadow intensity
            showCover: true,
            mobileScrollSupport: false // disable mobile scroll support
        });

        pageFlip.loadFromHTML(document.querySelectorAll('.page'));

        // Controls
        document.getElementById('prevBtn').addEventListener('click', () => {
            pageFlip.flipPrev();
        });

        document.getElementById('nextBtn').addEventListener('click', () => {
            pageFlip.flipNext();
        });

        // Current page indicator
        const pageNum = document.getElementById('page-num');
        const totalPage = document.getElementById('total-page');
        totalPage.innerText = bookData.pages;

        pageFlip.on('flip', (e) => {
            pageNum.innerText = e.data + 1;
        });

    } catch (error) {
        console.error('Error initializing viewer:', error);
    }
}

// Check which page we are on
if (document.getElementById('shelf')) {
    initBookshelf();
} else if (document.getElementById('book')) {
    window.addEventListener('DOMContentLoaded', initViewer);
}
