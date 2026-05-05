import { useState, useEffect } from "react";
import { searchProduct, addProduct, getAllProducts } from "../api/productsApi";
import ProductCard from "../components/ProductCard";
import { Link } from "react-router-dom";

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [showQuestion, setShowQuestion] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({ price: "", quantity: "" });
  const [addSuccess, setAddSuccess] = useState("");

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getAllProducts();
        setAllProducts(data);
      } catch (err) {
        console.error("Eroare:", err);
      }
    }
    loadProducts();
  }, []);

  async function handleSearch(e) {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    setError("");
    setSearched(true);
    setShowQuestion(false);
    setShowAddForm(false);
    setAddSuccess("");

    try {
      const data = await searchProduct(searchTerm);
      setResults(data);
    } catch (err) {
      setError("Ne pare rău, produsul nu a fost găsit în magazinul nostru.");
      setResults([]);
      setShowQuestion(true);
    } finally {
      setLoading(false);
    }
  }

  function handleYes() {
    setShowQuestion(false);
    setShowAddForm(true);
  }

  function handleNo() {
    setShowQuestion(false);
    setError("");
  }

  async function handleAddProduct(e) {
    e.preventDefault();

    const productData = {
      name: searchTerm.trim(),
      price: parseFloat(newProduct.price),
      quantity: parseInt(newProduct.quantity),
    };

    try {
      await addProduct(productData);
      setAddSuccess(`Produsul "${searchTerm}" a fost adăugat cu succes!`);
      setShowAddForm(false);
      setError("");
      
      const updatedProducts = await getAllProducts();
      setAllProducts(updatedProducts);
      
      setTimeout(async () => {
        const data = await searchProduct(searchTerm);
        setResults(data);
        setAddSuccess("");
      }, 2000);
      
      setNewProduct({ price: "", quantity: "" });
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-5 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">TechStore</h1>
          <Link to="/manage" className="text-sm text-gray-300 hover:text-white">
            Administrare
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="max-w-3xl mx-auto mb-12">
          <form onSubmit={handleSearch} className="space-y-5">
            <div>
              <label className="block text-white text-lg mb-2">
                Care este numele produsului?
              </label>
              <br />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ex: Widget, Thing, iPad..."
                className="w-full px-10 py-8 text-3xl bg-gray-800 text-white border-2 border-gray-700 rounded-lg focus:border-blue-500 focus:outline-none placeholder-gray-500"
                autoFocus
              />
            </div>
            <button
              type="submit"
              disabled={loading || !searchTerm.trim()}
              className="w-full py-6 text-2xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:bg-gray-700 rounded-lg transition"
            >
              {loading ? "Se caută..." : "Caută"}
            </button>
          </form>
        </div>

        {!searched && allProducts.length > 0 && (
          <div className="max-w-3xl mx-auto mb-12">
            <h2 className="text-lg font-semibold text-white mb-5">
              Produse disponibile în magazin:
            </h2>
            <div className="space-y-3">
              {allProducts.map((product) => (
                <div
                  key={product.id}
                  className="px-5 py-3 bg-gray-800 text-white text-base font-medium border border-gray-700 rounded-lg"
                >
                  {product.name}
                </div>
              ))}
            </div>
          </div>
        )}

        {addSuccess && (
          <div className="mb-8 py-4 px-5 bg-green-900 text-green-200 border-l-4 border-green-500 max-w-3xl mx-auto rounded">
            {addSuccess}
          </div>
        )}

        {showQuestion && (
          <div className="mb-12 max-w-3xl mx-auto">
            <div className="bg-yellow-900 border border-yellow-700 p-8 rounded-lg">
              <h3 className="text-xl font-semibold text-yellow-100 mb-4">
                {error}
              </h3>
              <p className="text-yellow-200 mb-6">
                Vrei să adaugi produsul "{searchTerm}" în magazin?
              </p>
              <div className="flex gap-4">
                <button
                  onClick={handleYes}
                  className="flex-1 py-3 bg-green-600 text-white text-lg font-semibold hover:bg-green-700 rounded-lg"
                >
                  Da
                </button>
                <button
                  onClick={handleNo}
                  className="flex-1 py-3 bg-gray-700 text-white text-lg font-medium hover:bg-gray-600 rounded-lg"
                >
                  Nu
                </button>
              </div>
            </div>
          </div>
        )}

        {showAddForm && (
          <div className="mb-12 max-w-3xl mx-auto">
            <div className="bg-gray-800 border border-gray-700 p-8 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-6">
                Adaugă produs: "{searchTerm}"
              </h3>
              <form onSubmit={handleAddProduct} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Preț (RON)
                    </label>
                    <input
                      type="number"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      required
                      min="0.01"
                      step="0.01"
                      placeholder="25.00"
                      className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Cantitate
                    </label>
                    <input
                      type="number"
                      value={newProduct.quantity}
                      onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
                      required
                      min="0"
                      placeholder="5"
                      className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-green-600 text-white font-semibold hover:bg-green-700 rounded-lg"
                  >
                    Salvează
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      setNewProduct({ price: "", quantity: "" });
                    }}
                    className="px-8 py-3 bg-gray-700 text-white font-medium hover:bg-gray-600 rounded-lg"
                  >
                    Anulează
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {results.length > 0 && (
          <div className="pb-16">
            <h2 className="text-xl text-white font-semibold mb-6">Rezultate:</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {results.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}