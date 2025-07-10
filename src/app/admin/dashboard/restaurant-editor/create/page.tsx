// src/app/dashboard/restaurants/create/page.tsx
"use client";

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import Link from 'next/link';
import toast from 'react-hot-toast';
import PhoneInput from "@/components/PhoneInput";

export default function CreateRestaurantPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [uuid, setUuid] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);


  useEffect(() => {
    // Generate UUID when component mounts
    const generateUUID = () => {
      return crypto.randomUUID();
    };
    setUuid(generateUUID());
  }, []);

  const handleSubmit = async (event: FormEvent) => {
  event.preventDefault();
  setIsLoading(true);
  setError('');

  const token = localStorage.getItem('access_token');
  if (!token) {
    setError('You are not logged in!');
    router.push('/');
    return;
  }

  try {
    console.log('Creating restaurant...');
    const restaurantResponse = await api.post(
      '/restaurants',
      {
        uuid,
        name,
        phone,
        location,
        cuisine,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const newRestaurantId = restaurantResponse.data?.id;
    console.log('Restaurant created with ID:', newRestaurantId);

    if (newRestaurantId) {
      // ✅ Upload image if selected
      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);

        try {
          await api.post(`/restaurants/${newRestaurantId}/upload-image`, formData, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          });
          console.log("Image uploaded after creation.");
        } catch (err) {
          console.error("Image upload failed:", err);
          toast.error("Restaurant created, but image upload failed.");
        }
      }

      toast.success('Restaurant created successfully!');
      router.push(`/admin/dashboard/restaurant-editor/${newRestaurantId}`);
    } else {
      console.error('Restaurant created but no ID returned');
      toast.error('Restaurant created but encountered an error. Please try again.');
      router.push('/admin/dashboard');
    }

  } catch (err: any) {
    console.error('Error creating restaurant:', err);
    let message = 'Failed to create restaurant.';

    if (err.response?.status === 500) {
      message = 'Server error. Please try again later.';
    } else if (err.response?.data?.message) {
      if (Array.isArray(err.response.data.message)) {
        message = err.response.data.message.join(', ');
      } else {
        message = err.response.data.message;
      }
    }

    setError(message);
    toast.error(message);
  } finally {
    setIsLoading(false);
  }
};
  return (
    <main className="min-h-screen bg-card text-foreground p-8 flex items-center justify-center">
      <div className="w-full max-w-lg p-8 space-y-6 bg-muted rounded-lg shadow-lg">
        <header>
          <Link href="/admin/dashboard" className="text-blue-400 hover:underline">
            &larr; Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-center mt-4">Create a New Restaurant</h1>
        </header>

<form onSubmit={handleSubmit} className="space-y-4">
  {/* صورة المعاينة فوق الاسم */}
  <div
    className="w-full h-48 rounded overflow-hidden border border-border flex items-center justify-center bg-background cursor-pointer relative"
    onClick={() => document.getElementById('restaurant-image-input')?.click()}
  >
    {previewImageUrl ? (
      <img
        src={previewImageUrl}
        alt="Preview"
        className="object-cover w-full h-full"
      />
    ) : (
      <span className="text-muted-foreground text-sm">Click to upload image</span>
    )}

    {/* زر إزالة الصورة */}
    {previewImageUrl && (
      <button
        onClick={(e) => {
          e.stopPropagation();
          setPreviewImageUrl(null);
          setImageFile(null);
        }}
        className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded"
      >
        Remove
      </button>
    )}

    <input
      id="restaurant-image-input"
      type="file"
      accept="image/*"
      className="hidden"
      onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) {
          setImageFile(file);
          setPreviewImageUrl(URL.createObjectURL(file));
        }
      }}
    />
  </div>
          {error && <p className="text-red-500 text-center">{error}</p>}

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-muted-foreground">Name</label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 p-2 bg-muted rounded-md border border-border"
            />
          </div>

         <div>
  <label className="block text-sm font-medium text-muted-foreground">Phone</label>
  <PhoneInput
    value={phone}
    onChange={setPhone}
  />
</div>


          <div>
            <label htmlFor="cuisine" className="block text-sm font-medium text-muted-foreground">Cuisine Type</label>
            <input
              id="cuisine"
              type="text"
              required
              value={cuisine}
              onChange={(e) => setCuisine(e.target.value)}
              className="w-full mt-1 p-2 bg-muted rounded-md border border-border"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-2 font-bold text-foreground bg-green-600 rounded-md hover:bg-green-700 disabled:bg-white0"
            >
              {isLoading ? 'Creating...' : 'Create Restaurant'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
