import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { Restaurant } from '@/types/restaurant';

export const useRestaurantData = (restaurantId?: string) => {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRestaurant = async () => {
      if (!restaurantId) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get(`/restaurants/${restaurantId}`);
        setRestaurant(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch restaurant data');
        setRestaurant(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [restaurantId]);

  return { restaurant, loading, error };
};

export default useRestaurantData;
