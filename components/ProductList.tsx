
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import ProductCard from './ProductCard';
import { Product } from '../types';
import ProductModal from './ProductModal';
import { useSettings } from '../context/SettingsContext';


const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { t } = useSettings();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error: dbError } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false }); 

        if (dbError) {
          throw dbError;
        }

        setProducts(data || []);
      } catch (err: any) {
        console.error('Error fetching products:', err);
        setError('Could not fetch products. Please ensure your Supabase table is configured correctly.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div className="text-center text-gray-500 animate-pulse">Loading Products...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 bg-red-100 dark:bg-red-900/30 p-4 rounded-lg">{error}</div>;
  }

  if (products.length === 0) {
      return <div className="text-center text-gray-500">No products found. Add some in your Supabase dashboard!</div>;
  }

  return (
    <div className="w-full">
        <h1 className="text-4xl font-bold text-center mb-10 bg-clip-text text-transparent bg-gradient-to-r from-[var(--gradient-from)] to-[var(--gradient-to)] dark:from-[var(--accent-color-dark)] dark:to-[var(--gradient-to)] pb-2 animate-fadeInDown">
            Discover Our Products
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} onProductClick={setSelectedProduct} t={t} />
            ))}
        </div>
        {selectedProduct && (
            <ProductModal
                product={selectedProduct}
                isOpen={!!selectedProduct}
                onClose={() => setSelectedProduct(null)}
                t={t}
            />
        )}
    </div>
  );
};

export default ProductList;
