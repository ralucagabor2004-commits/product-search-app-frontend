const BASE_URL = `${import.meta.env.VITE_API_URL}/api/products`;

// GET toate produsele
export async function getAllProducts() {
  const response = await fetch(BASE_URL);
  if (!response.ok) throw new Error("Nu s-au putut prelua produsele");
  return response.json();
}

// GET căutare produs
export async function searchProduct(name) {
  const response = await fetch(`${BASE_URL}/search?name=${encodeURIComponent(name)}`);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Eroare la căutare");
  }
  return response.json();
}

// POST adaugă produs
export async function addProduct(product) {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.errors?.join(", ") || error.error || "Eroare la adăugare");
  }
  return response.json();
}

// PUT actualizare produs
export async function updateProduct(id, product) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.errors?.join(", ") || error.error || "Eroare la actualizare");
  }
  return response.json();
}

// DELETE șterge produs
export async function deleteProduct(id) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Eroare la ștergere");
}
