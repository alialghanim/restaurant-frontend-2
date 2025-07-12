"use client";

import { useState, useEffect } from "react";import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";
import { MoreHorizontal, Pencil, Trash2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

interface Category {
  id: string;
  name: string;
  image?: string;
}

interface Item {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  categoryId: string;
}

export default function MenuPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [editCategoryModal, setEditCategoryModal] = useState(false);
  const [editItemModal, setEditItemModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryImage, setNewCategoryImage] = useState<File | null>(null);
  const [editCategoryId, setEditCategoryId] = useState<string | null>(null);
  const [editCategoryName, setEditCategoryName] = useState("");
  const [editItem, setEditItem] = useState<Item | null>(null);
const [deleteTarget, setDeleteTarget] = useState<{ type: "category" | "item"; id: string } | null>(null);
const [optionModalOpen, setOptionModalOpen] = useState(false);
const [selectedOptionItem, setSelectedOptionItem] = useState<Item | null>(null);
const [itemOptions, setItemOptions] = useState<Record<string, { name: string; price?: number }[]>>({});
const [optionName, setOptionName] = useState("");
const [optionPrice, setOptionPrice] = useState("");
const [restaurantId, setRestaurantId] = useState<string | null>(null);

useEffect(() => {
  async function loadRestaurantId() {
    try {
      const res = await fetch("/api/restaurants/me/id"); // ✅ لاحظ المسار الجديد
      const data = await res.json();
      console.log("Trying to add with restaurantId:", data.id);
      setRestaurantId(data.id);
    } catch (err) {
      console.error("Failed to load restaurant ID", err);
    }
  }

  loadRestaurantId();
}, []);

useEffect(() => {
  async function fetchData() {
    if (!restaurantId) return;

    const [categoryRes, itemRes] = await Promise.all([
      fetch(`/api/restaurants/${restaurantId}/categories`),
      fetch(`/api/restaurants/${restaurantId}/items`),
    ]);

    const categoriesData = await categoryRes.json();
    const itemsData = await itemRes.json();

    setCategories(categoriesData);
    setItems(itemsData);
  }

  fetchData();
}, [restaurantId]);

const handleOpenOptionsModal = (item: Item) => {
  console.log("Opening option modal for:", item.name);
  setSelectedOptionItem(item);
  setOptionModalOpen(true);
};


const handleAddCategory = async () => {
  console.log("Trying to add with restaurantId:", restaurantId);
  if (!newCategoryName || !restaurantId) return;

  const res = await fetch(`/api/restaurants/${restaurantId}/categories`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: newCategoryName }),
  });

  const data = await res.json();
  setCategories((prev) => [...prev, data]);
  setNewCategoryName("");
  setModalOpen(false);
};


  const handleEditCategory = async () => {
  if (!editCategoryId || !editCategoryName) return;
  await fetch(`/api/categories/${editCategoryId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: editCategoryName }),
  });
  setCategories((prev) =>
    prev.map((cat) =>
      cat.id === editCategoryId ? { ...cat, name: editCategoryName } : cat
    )
  );
  setEditCategoryModal(false);
};

  const handleAddItem = async (item: Item) => {
  if (!restaurantId) {
  console.error("No restaurantId yet");
  return;
}

  const payload = { ...item, restaurantId }; // ⬅️ تأكد إنه يروح للباك

  const res = await fetch("/api/items", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  setItems((prev) => [...prev, data]);
  setItemModalOpen(false);
};

  const handleUpdateItem = async () => {
  if (!editItem) return;
  await fetch(`/api/items/${editItem.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(editItem),
  });
  setItems((prev) => prev.map((i) => (i.id === editItem.id ? editItem : i)));
  setEditItemModal(false);
  setEditItem(null);
};

  const filteredCategories =
    selectedCategoryId === null
      ? categories
      : categories.filter((cat) => cat.id === selectedCategoryId);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Menu</h1>
        <button
          onClick={() => setItemModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Item
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b pb-2 mb-6 text-sm font-medium overflow-x-auto">
        <button
          onClick={() => setSelectedCategoryId(null)}
          className={`pb-1 ${
            selectedCategoryId === null
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-blue-600"
          }`}
        >
          All
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategoryId(cat.id)}
            className={`pb-1 ${
              selectedCategoryId === cat.id
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-blue-600"
            }`}
          >
            {cat.name}
          </button>
        ))}

        {/* Add Category button */}
        <button
  disabled={!newCategoryName || !restaurantId}
  onClick={handleAddCategory}
  className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
>
  Add Category
</button>
      </div>

      {/* Category Sections */}
      {filteredCategories.length === 0 ? (
        <p className="text-gray-500">No categories yet.</p>
      ) : (
        filteredCategories.map((cat) => (
          <div key={cat.id} className="mb-10">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{cat.name}</h2>
              <div className="flex items-center gap-2">
  <button
    onClick={() => {
      setEditCategoryModal(true);
      setEditCategoryId(cat.id);
      setEditCategoryName(cat.name);
    }}
    className="text-blue-600 text-sm hover:underline flex items-center gap-1"
  >
    <Pencil className="w-4 h-4" />
    Edit
  </button>
  <button
    onClick={() => setDeleteTarget({ type: "category", id: cat.id })}
    className="text-red-500 text-sm hover:underline flex items-center gap-1"
  >
    <Trash2 className="w-4 h-4" />
    Delete
  </button>
</div>
            </div>

            <div className="space-y-4">
              {items.filter((item) => item.categoryId === cat.id).length === 0 ? (
                <p className="text-gray-400">No items yet in this category.</p>
              ) : (
                items
                  .filter((item) => item.categoryId === cat.id)
                  .map((item) => (
   <div
  key={item.id}
className="relative flex items-center border p-4 rounded">

  <div className="flex items-center gap-4 w-full">
    <div className="w-36 h-24 rounded overflow-hidden bg-gray-100 flex items-center justify-center">
      {item.image ? (
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="text-xs text-gray-400">No Image</span>
      )}
    </div>

    <div className="flex-1">
<div className="flex-1">
  <h3 className="font-semibold">{item.name}</h3>
  {item.description && (
    <p className="text-sm text-gray-500">{item.description}</p>
  )}
  <p className="text-sm font-bold text-gray-800 mt-1">${item.price.toFixed(2)}</p>

  {/* 🟢 عرض الخيارات (إن وُجدت) */}
  {itemOptions[item.id] && itemOptions[item.id].length > 0 && (
    <ul className="mt-2 text-sm text-gray-600 list-disc list-inside">
      {itemOptions[item.id].map((opt, index) => (
        <li key={index}>
          {opt.name}
          {opt.price ? ` (+$${opt.price.toFixed(2)})` : ""}
        </li>
      ))}
    </ul>
  )}
</div>

  

    </div>
  </div>

<div className="flex flex-col items-end justify-between h-full relative min-w-[60px]">
<div className="absolute top-2 right-2 z-10">
  <ItemActions
    item={item}
    onEdit={() => {
      setEditItem(item);
      setEditItemModal(true);
    }}
    onDelete={() => setDeleteTarget({ type: "item", id: item.id })}
  />
</div>

  <div className="flex-1" /> {/* هذا للدفع الباقي للأسفل */}

  <p className="text-sm font-bold text-gray-800 text-center w-full mt-12">
  </p>
</div>

</div>

                  ))
              )}
            </div>
          </div>
        ))
      )}

      {/* Add Category Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="w-full max-w-md fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl shadow-lg"
>
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Category Name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
            <button
              onClick={handleAddCategory}
              className="w-full bg-blue-600 text-white py-2 rounded"
            >
              Add Category
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Category Modal */}
      <Dialog open={editCategoryModal} onOpenChange={setEditCategoryModal}>
        <DialogContent className="w-full max-w-md fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl shadow-lg"
>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <input
              type="text"
              value={editCategoryName}
              onChange={(e) => setEditCategoryName(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
            <div className="flex justify-between gap-2">
              <button
                onClick={() => setEditCategoryModal(false)}
                className="w-full border border-gray-300 text-gray-600 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleEditCategory}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Item Modal */}
      <Dialog open={itemModalOpen} onOpenChange={setItemModalOpen}>
        <DialogContent className="w-full max-w-md fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl shadow-lg"
>
          <DialogHeader>
            <DialogTitle>Add New Item</DialogTitle>
          </DialogHeader>

          {categories.length === 0 ? (
            <p className="text-sm text-gray-500">Please add a category first.</p>
          ) : (
            <AddItemForm onSubmit={handleAddItem} categories={categories} />
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Item Modal */}
      <Dialog open={editItemModal} onOpenChange={setEditItemModal}>
        <DialogContent
          className="w-full max-w-md fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl shadow-lg"
        >
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
          </DialogHeader>
          {editItem && (
            <EditItemForm
              item={editItem}
              setItem={setEditItem}
              onSave={handleUpdateItem}
              onCancel={() => setEditItemModal(false)}
              categories={categories}
            />
          )}
        </DialogContent>
      </Dialog>

      {deleteTarget && (
<ConfirmDeleteModal
  isOpen={!!deleteTarget}
  onClose={() => setDeleteTarget(null)}
  title="Delete Confirmation"
  message="Are you sure you want to delete this item?"
  onConfirm={async () => {
    if (deleteTarget?.type === "category") {
      await fetch(`/api/categories/${deleteTarget.id}`, { method: "DELETE" });
      setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      setItems((prev) => prev.filter((i) => i.categoryId !== deleteTarget.id));
    } else {
      await fetch(`/api/items/${deleteTarget.id}`, { method: "DELETE" });
      setItems((prev) => prev.filter((i) => i.id !== deleteTarget.id));
    }
    setDeleteTarget(null);
  }}
/>
)}
    </div>
  );
}

function AddItemForm({ onSubmit, categories }: { onSubmit: (item: Item) => void; categories: Category[] }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [categoryId, setCategoryId] = useState(categories[0]?.id || "");
const [preview, setPreview] = useState<string | null>(null);

const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  setImage(file || null);
  if (file) {
    setPreview(URL.createObjectURL(file));
  }
};

  const handleSubmit = () => {
    if (!name || !price || !categoryId) return;
    const newItem: Item = {
      id: Date.now().toString(),
      name,
      price: parseFloat(price),
      description,
      image: image ? URL.createObjectURL(image) : undefined,
      categoryId,
    };
    onSubmit(newItem);
    setName("");
    setPrice("");
    setDescription("");
    setImage(null);
  };

  return (
    
    <div className="space-y-4">
        <div className="w-full h-40 bg-gray-100 border-2 border-dashed rounded flex items-center justify-center relative overflow-hidden">
  <label className="w-full h-full flex items-center justify-center cursor-pointer">
    {preview ? (
<img src={preview} alt="Preview" className="w-full h-full object-fill" />
    ) : (
      <span className="text-gray-400">Add Image</span>
    )}
    <input
      type="file"
      onChange={handleImageChange}
      className="hidden"
    />
  </label>
  {preview && (
    <button
      onClick={() => {
        setImage(null);
        setPreview(null);
      }}
      className="absolute top-2 right-2 bg-white rounded-full w-6 h-6 flex items-center justify-center shadow text-sm text-gray-700"
    >
      ×
    </button>
  )}
</div>
      <input
        type="text"
        placeholder="Item Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border rounded px-3 py-2"
      />
      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="w-full border rounded px-3 py-2"
      />
      <textarea
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full border rounded px-3 py-2"
      />
      <select
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
        className="w-full border rounded px-3 py-2"
      >
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>
      <button
        onClick={handleSubmit}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Add Item
      </button>
    </div>
  );
}

function ItemActions({
  item,
  onEdit,
  onDelete,
}: {
  item: Item;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="text-gray-600 hover:text-black"
      >
        <MoreHorizontal className="w-5 h-5" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 bg-white border rounded shadow-md w-40 z-10">
          <button
            onClick={() => {
              onEdit();
              setOpen(false);
            }}
            className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 w-full"
          >
            <Pencil className="w-4 h-4" />
            Edit
          </button>

          <button
            onClick={() => {
              onDelete();
              setOpen(false);
            }}
            className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 w-full text-red-500"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>

          <button
            onClick={() => {
              router.push(`/admin/menu/${item.id}/options`);
              setOpen(false);
            }}
            className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 w-full text-green-600"
          >
            <Plus className="w-4 h-4" />
            Add Options
          </button>
        </div>
      )}
    </div>
  );
}

function EditItemForm({
  item,
  setItem,
  onSave,
  onCancel,
  categories,
}: {
  item: Item;
  setItem: (item: Item) => void;
  onSave: () => void;
  onCancel: () => void;
  categories: Category[];
}) {
  return (
    <div className="space-y-4">
      <input
        type="text"
        value={item.name}
        onChange={(e) => setItem({ ...item, name: e.target.value })}
        className="w-full border rounded px-3 py-2"
      />
      <input
        type="number"
        value={item.price}
        onChange={(e) => setItem({ ...item, price: parseFloat(e.target.value) })}
        className="w-full border rounded px-3 py-2"
      />
      <textarea
        value={item.description}
        onChange={(e) => setItem({ ...item, description: e.target.value })}
        className="w-full border rounded px-3 py-2"
      />
      <select
        value={item.categoryId}
        onChange={(e) => setItem({ ...item, categoryId: e.target.value })}
        className="w-full border rounded px-3 py-2"
      >
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>
      <div className="flex justify-between gap-2">
        <button
          onClick={onCancel}
          className="w-full border border-gray-300 text-gray-600 py-2 rounded"
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Save
        </button>
      </div> 
    </div>  
  );
}