import axios from '@/lib/axios';

export default async function StorePage({ params }: { params: { domain: string } }) {
  const restaurant = await axios
    .get(`/restaurants/domain/${params.domain}`) // ✅ استخدم domain من URL
    .then((res) => res.data)
    .catch(() => null);

  if (!restaurant) {
  return (
    <div className="text-center py-20 text-gray-500">
      <h2 className="text-2xl font-semibold">This store was not found</h2>
      <p className="mt-2">Please check the domain or try again later.</p>
    </div>
  );
}

  return (
    <div>
      <h1>{restaurant.name}</h1>
      <p>{restaurant.description}</p>
    </div>
  );
}
