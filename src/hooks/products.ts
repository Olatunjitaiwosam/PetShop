import { useState, useEffect } from 'react';
import { supabase } from '../lib/superbase';
import { IProduct } from '../models';

export const useProducts = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) setError(error.message);
    else setProducts(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const addProduct = async (product: IProduct) => {
    const { data, error } = await supabase
      .from('products')
      .insert(product)
      .select()
      .single();

    if (error) setError(error.message);
    else setProducts(prev => [data, ...prev]);
  };

  return { loading, error, products, addProduct };
};