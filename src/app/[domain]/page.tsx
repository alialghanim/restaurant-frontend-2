import axios from '@/lib/axios';

export default async function StorePage({ params }: { params: { domain: string } }) {
  if (!params.domain) {
    return <div className="text-center py-20">Invalid store domain.</div>;
  }

  const restaurant = await axios
    .get(`/restaurants/domain/${params.domain}`)
    .then((res) => res.data)
    .catch((err) => {
      console.error("❌ Error fetching restaurant:", err);
      return null;
    });

  if (!restaurant) {
    return (
      <div className="text-center py-20 text-gray-500">
        <h2 className="text-2xl font-semibold">This store was not found</h2>
        <p className="mt-2">Please check the domain or try again later.</p>
      </div>
    );
  }

  if (restaurant.status !== 'ACTIVE') {
    return (
      <div className="text-center py-20 text-gray-400">
        <h2 className="text-2xl font-semibold">This store is currently unavailable</h2>
        <p className="mt-2">Please try again later.</p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: restaurant.storeColor || '#fff' }} className="min-h-screen">
      {restaurant.image && (
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-64 object-cover mb-6"
        />
      )}

      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-2">{restaurant.name}</h1>
        {restaurant.description && (
          <p className="text-gray-700 mb-4">{restaurant.description}</p>
        )}

        {/* لاحقاً: عرض الأقسام والمنتجات هنا */}
        {/* {restaurant.menu?.categories.map(...) */}
      </div>
    </div>
  );
}
