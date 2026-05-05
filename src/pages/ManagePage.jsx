import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  getAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../api/productsApi";
import ProductCard from "../components/ProductCard";

export default function ManagePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    quantity: "",
  });
  const [feedback, setFeedback] = useState({ message: "", type: "" });
  const [sortBy, setSortBy] = useState("name-asc");
  const [searchFilter, setSearchFilter] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const data = await getAllProducts();
      setProducts(data);
    } catch (err) {
      showFeedback(err.message, "error");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const productData = {
      name: formData.name.trim(),
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity),
    };

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
        showFeedback("Produsul a fost actualizat", "success");
      } else {
        await addProduct(productData);
        showFeedback("Produsul a fost adăugat", "success");
      }
      resetForm();
      fetchProducts();
    } catch (err) {
      showFeedback(err.message, "error");
    }
  }

  function handleEdit(product) {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      quantity: product.quantity,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id) {
    if (!window.confirm("Sigur vrei să ștergi acest produs?")) return;

    try {
      await deleteProduct(id);
      showFeedback("Produsul a fost șters", "success");
      fetchProducts();
    } catch (err) {
      showFeedback(err.message, "error");
    }
  }

  function resetForm() {
    setEditingProduct(null);
    setFormData({ name: "", price: "", quantity: "" });
  }

  function showFeedback(message, type) {
    setFeedback({ message, type });
    setTimeout(() => setFeedback({ message: "", type: "" }), 3000);
  }

  function getSortedAndFilteredProducts() {
    let filtered = [...products];

    if (searchFilter.trim()) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchFilter.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "stock-asc":
          return a.quantity - b.quantity;
        case "stock-desc":
          return b.quantity - a.quantity;
        default:
          return 0;
      }
    });

    return filtered;
  }

  const displayedProducts = getSortedAndFilteredProducts();

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-6xl mx-auto px-6 py-5 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Administrare produse</h1>
          <Link to="/" className="text-sm text-gray-300 hover:text-white font-medium">
            Înapoi la magazin
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {feedback.message && (
          <div
            className={`mb-8 py-4 px-5 border-l-4 rounded ${
              feedback.type === "success"
                ? "bg-green-900 text-green-200 border-green-500"
                : "bg-red-900 text-red-200 border-red-500"
            }`}
          >
            {feedback.message}
          </div>
        )}

        <div className="mb-12 max-w-2xl">
          <h2 className="text-lg font-semibold text-white mb-4">
            {editingProduct ? "Editează produs" : "Adaugă produs nou"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4 bg-gray-800 border border-gray-700 p-6 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nume produs
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none"
                placeholder="ex: Laptop Dell"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Preț (RON)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0.01"
                  step="0.01"
                  className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Stoc
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none"
                  placeholder="0"
                />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white font-semibold hover:bg-blue-700 rounded-lg"
              >
                {editingProduct ? "Actualizează" : "Adaugă"}
              </button>
              {editingProduct && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 bg-gray-700 text-white font-medium hover:bg-gray-600 rounded-lg"
                >
                  Anulează
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="mb-6 flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[250px]">
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Filtrează după nume..."
              className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-lg focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-lg focus:border-blue-500 focus:outline-none"
            >
              <option value="name-asc">Nume (A-Z)</option>
              <option value="name-desc">Nume (Z-A)</option>
              <option value="price-asc">Preț crescător</option>
              <option value="price-desc">Preț descrescător</option>
              <option value="stock-asc">Stoc crescător</option>
              <option value="stock-desc">Stoc descrescător</option>
            </select>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-white mb-6">
            Toate produsele ({displayedProducts.length} / {products.length})
          </h2>
          {loading ? (
            <p className="text-gray-400 text-sm">Se încarcă...</p>
          ) : displayedProducts.length === 0 ? (
            <p className="text-gray-400 text-sm">
              {searchFilter ? "Nu s-au găsit produse cu acest nume" : "Nu există produse"}
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {displayedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}