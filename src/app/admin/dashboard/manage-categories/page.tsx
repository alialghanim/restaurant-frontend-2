'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import api from '@/lib/axios'
import CategorySidebar from '@/components/dashboard/CategorySidebar'

interface Category {
  id: string
  name: string
}

interface Restaurant {
  id: string
  name: string
}

const ManageCategoriesPage = () => {
  const params = useParams()
  const restaurantId = params?.restaurantId as string

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [categories, setCategories] = useState<Category[]>([])

  const fetchRestaurant = async () => {
    const res = await api.get(`/restaurants/${restaurantId}`)
    setRestaurant(res.data)
  }

  const fetchCategories = async () => {
    const res = await api.get(`/restaurants/${restaurantId}/categories`)
    setCategories(res.data)
  }

  const handleEdit = (category: Category) => {
    console.log('[EDIT] category:', category)
    // 👈 تقدر تفتح مودال التعديل هنا
  }

  const handleDelete = async (id: string) => {
    await api.delete(`/restaurants/${restaurantId}/categories/${id}`)
    fetchCategories()
  }

  useEffect(() => {
    if (restaurantId) {
      fetchRestaurant()
      fetchCategories()
    }
  }, [restaurantId])

  return (
    <div className="flex">
      <CategorySidebar
        categories={categories}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-semibold mb-2">Manage Categories</h1>
        {restaurant && (
          <div className="text-gray-600 mb-4">
            <span className="font-medium">Restaurant:</span> {restaurant.name}
          </div>
        )}

        {categories.length === 0 ? (
          <p className="text-gray-500">No categories found.</p>
        ) : (
          <ul className="space-y-2">
            {categories.map((category) => (
              <li
                key={category.id}
                className="border p-4 rounded shadow-sm flex justify-between items-center"
              >
                <span>{category.name}</span>
                <div className="space-x-2">
                  <button
                    className="text-blue-500 hover:underline"
                    onClick={() => handleEdit(category)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-500 hover:underline"
                    onClick={() => handleDelete(category.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default ManageCategoriesPage
