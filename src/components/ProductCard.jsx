export default function ProductCard({ product, onEdit, onDelete }) {
  function getProductImage(name) {
    const images = {
      'Widget': '/images/widget.jpg',
      'Thing': '/images/thing.jpg',
      'Doodad': '/images/doodad.jpg'
    };
    
    return images[name] || '/images/widget.jpg';
  }

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden hover:border-gray-600 transition">
      <img 
        src={getProductImage(product.name)} 
        alt={product.name}
        className="w-full h-48 object-cover bg-gray-700"
      />
      
      <div className="p-5">
        <h3 className="text-xl font-semibold text-white mb-2">{product.name}</h3>
        <p className="text-sm text-gray-400 mb-3">Stoc: {product.quantity} buc</p>
        <p className="text-2xl font-bold text-white mb-4">{product.price.toFixed(2)} RON</p>

        {(onEdit || onDelete) && (
          <div className="flex gap-2 pt-3 border-t border-gray-700">
            {onEdit && (
              <button
                onClick={() => onEdit(product)}
                className="flex-1 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Editează
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(product.id)}
                className="flex-1 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700"
              >
                Șterge
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}