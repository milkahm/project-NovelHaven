const cart = [];
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
searchInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    searchButton.click(); 
  }
});

async function fetchBooks(query = "classic") {
  try {
    const response = await fetch(`https://openlibrary.org/search.json?q=${query}&limit=3`);
    const data = await response.json();

    // Transform the results to match our format
    const books = data.docs.map((book, index) => ({
      id: index + 1, 
      title: book.title,
      price: (Math.random() * 20 + 5).toFixed(2), 
      cover: book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : "placeholder.jpg"
    }));

    displayNovels(books);
  } catch (error) {
    console.error("Error fetching books:", error);
  }
}

function displayNovels(novels) {
  const novelList = document.getElementById("novel-list");
  novelList.innerHTML = ""; 

  novels.forEach(novel => {
    const novelDiv = document.createElement("div");
    novelDiv.innerHTML = `
      <img src="${novel.cover}" alt="${novel.title}" width="100">
      <p>${novel.title} - $${novel.price}</p>
      <button onclick="addToCart(${novel.id}, '${novel.title}', ${novel.price})">Add to Cart</button>
    `;
    novelList.appendChild(novelDiv);
  });
}

function addToCart(id, title, price) {
  if (cart.some(novel => novel.id === id)) {
    alert("This book is already in the cart!");
    return;
  }
  const novel = { id, title, price };
  cart.push(novel);
  updateCart();
}

function updateCart() {
  const cartItems = document.getElementById("cart-items");
  const totalElement = document.getElementById("total");

  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach((novel, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${novel.title} - $${novel.price}
      <button onclick="removeFromCart(${index})">Remove</button>
    `;
    cartItems.appendChild(li);
    total += parseFloat(novel.price);
  });

  totalElement.textContent = total.toFixed(2);
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCart();
}

document.getElementById("checkout").addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Your cart is empty!");
  } else {
    alert("Thank you for your purchase!");
    cart.length = 0;
    updateCart();
  }
});

// Event listener for the search bar
searchButton.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (query) {
    fetchBooks(query);
  } else {
    alert("Please enter a search term!");
  }
});searchInput.addEventListener("paste", () => {
    setTimeout(() => {
      const query = searchInput.value.trim();
      if (query) {
        fetchBooks(query);
      }
    }, 0);
});

window.addEventListener("resize", () => {
  console.log(`Window resized: ${window.innerWidth}x${window.innerHeight}`);
});


fetchBooks();
