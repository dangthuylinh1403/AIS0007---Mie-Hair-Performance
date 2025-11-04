import React, { useContext, useState } from 'react';
import { Product, Translation } from '../types';
import { CartContext } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  onProductClick: (product: Product) => void;
  t: Translation;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onProductClick, t }) => {
  const { addToCart } = useContext(CartContext);
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };
  
  return (
    <div 
      className="group relative bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl border border-black/5 dark:border-white/10 overflow-hidden transition-all duration-300 hover:-translate-y-1 animate-fadeInUp cursor-pointer"
      onClick={() => onProductClick(product)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onProductClick(product)}
    >
      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
      </div>
      <div className="p-5 absolute bottom-0 left-0 right-0">
        <h3 className="text-lg font-bold text-white group-hover:text-[var(--accent-color-dark)] transition-colors duration-300 truncate">
          {product.name}
        </h3>
        <p className="mt-1 text-sm text-gray-200 dark:text-gray-300 line-clamp-2 h-[2.5em]">{product.description}</p>
        <div className="mt-4 flex justify-between items-center">
          <p className="text-xl font-semibold text-white">
            ${product.price.toLocaleString()}
          </p>
          <button 
            onClick={handleAddToCart}
            disabled={added}
            className={`px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-[var(--gradient-from)] to-[var(--gradient-to)] rounded-full shadow-md transform transition-all duration-300 group-hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-[var(--accent-color)] disabled:opacity-80 disabled:cursor-not-allowed ${added ? 'bg-green-500 from-green-500 to-green-600' : ''}`}
          >
            {added ? t.addedToCart : t.addToCart}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;