"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";

export default function AddOptionsPage() {
  const { itemId } = useParams();
  const router = useRouter();

  const [sections, setSections] = useState([
    {
      id: Date.now().toString(),
      title: "",
      type: "single",
      min: 0,
      max: 1,
      options: [{ id: "opt-1", name: "", price: "" }],
    },
  ]);

  useEffect(() => {
  async function fetchOptions() {
    const res = await fetch(`/api/items/${itemId}/options`);
    const data = await res.json();
    setSections(data.sections);
  }

  if (itemId) fetchOptions();
}, [itemId]);

 const handleSaveOptions = async () => {
  if (!itemId) return;

  const cleanedSections = sections.map((sec) => ({
    title: sec.title,
    type: sec.type,
    min: sec.min,
    max: sec.max,
    options: sec.options.map((opt) => ({
      name: opt.name,
      price: parseFloat(opt.price || "0"), // ← يحولها من نص إلى رقم
    })),
  }));

  const res = await fetch(`/api/items/${itemId}/options`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sections: cleanedSections }),
  });

  if (res.ok) {
    alert("Options saved!");
    router.back();
  } else {
    alert("Failed to save options.");
  }
};


  const handleAddSection = () => {
    setSections(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        title: "",
        type: "single",
        min: 0,
        max: 1,
        options: [],
      },
    ]);
  };

  const handleAddOption = (sectionId: string) => {
    setSections(prev =>
      prev.map(section =>
        section.id === sectionId
          ? {
              ...section,
              options: [...section.options, { id: Date.now().toString(), name: "", price: "" }],
            }
          : section
      )
    );
  };

  const handleRemoveOption = (sectionId: string, optionId: string) => {
    setSections(prev =>
      prev.map(section =>
        section.id === sectionId
          ? {
              ...section,
              options: section.options.filter(opt => opt.id !== optionId),
            }
          : section
      )
    );
  };

  return (
    <div className="p-6">
     <div className="mb-6 space-y-2">
  <button
    onClick={() => router.back()}
    className="text-sm text-gray-600 hover:text-black underline"
  >
    ← Back
  </button>

  <div className="flex items-center justify-between">
    <h1 className="text-2xl font-bold text-gray-800">Add Options</h1>
    <button
      onClick={handleAddSection}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
    >
      + Add Section
    </button>
  </div>
</div>

      <div className="space-y-6">
        {sections.map((section, sectionIndex) => (
         <div key={section.id} className="border rounded bg-gray-50 p-4 shadow-sm space-y-4">
  {/* عنوان القسم */}
<div className="flex justify-between items-center">
  <h2 className="text-xl font-bold text-gray-800">
    {section.title || `Section ${sectionIndex + 1}`}
  </h2>
  <select
    value={section.type}
    onChange={(e) => {
      const type = e.target.value;
      setSections(prev => {
        const copy = [...prev];
        copy[sectionIndex].type = type;
        return copy;
      });
    }}
className="border px-2 py-1 rounded text-sm"  >
    <option value="single">Single</option>
    <option value="multiple">Multiple</option>
  </select>
</div>

  {/* عنوان القسم النصي */}
  <input
  type="text"
  placeholder="Section Title (e.g. Choose Sauce)"
  className="border px-3 py-2 rounded w-full mb-2"
  value={section.title}
  onChange={(e) => {
    const title = e.target.value;
    setSections(prev => {
      const copy = [...prev];
      copy[sectionIndex].title = title;
      return copy;
    });
  }}
/>

  {/* خيارات الملتي */}
  {section.type === "multiple" && (
    <div className="flex gap-4">
      <input
        type="number"
        min={0}
        placeholder="Min"
        value={section.min}
        onChange={(e) => {
          const val = Math.max(0, parseInt(e.target.value) || 0);
          setSections(prev => {
            const copy = [...prev];
            copy[sectionIndex].min = val;
            return copy;
          });
        }}
        className="w-24 border px-3 py-2 rounded"
      />
      <input
        type="number"
        min={0}
        placeholder="Max"
        value={section.max}
        onChange={(e) => {
          const val = Math.max(0, parseInt(e.target.value) || 0);
          setSections(prev => {
            const copy = [...prev];
            copy[sectionIndex].max = val;
            return copy;
          });
        }}
        className="w-24 border px-3 py-2 rounded"
      />
    </div>
  )}

  {/* الخيارات داخل القسم */}
  <h3 className="text-sm font-semibold text-gray-600 mt-4 mb-1">Options</h3>

  <div className="space-y-2">
    {section.options.map((opt, optIndex) => (
  <div key={opt.id} className="flex gap-2 items-center">
    <span className="text-sm text-gray-500 w-5">{optIndex + 1}.</span>
        <input
          type="text"
          placeholder="Option name"
          value={opt.name}
          onChange={(e) => {
            const name = e.target.value;
            setSections(prev => {
              const copy = [...prev];
              copy[sectionIndex].options[optIndex].name = name;
              return copy;
            });
          }}
          className="flex-1 border px-3 py-2 rounded"
        />
        <input
          type="number"
          placeholder="Price (optional)"
          value={opt.price}
          onChange={(e) => {
            const price = e.target.value;
            setSections(prev => {
              const copy = [...prev];
              copy[sectionIndex].options[optIndex].price = price;
              return copy;
            });
          }}
          className="w-32 border px-3 py-2 rounded"
        />
        <button
          onClick={() => handleRemoveOption(section.id, opt.id)}
          className="text-red-500 hover:underline"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    ))}

    {/* زر إضافة خيار */}
    <button
      onClick={() => handleAddOption(section.id)}
      className="flex items-center gap-2 text-sm text-blue-600 hover:underline mt-2"
    >
      <Plus className="w-4 h-4" /> Add Option
    </button>
  </div>
</div>
        ))}
      </div>

      <div className="mt-6">
        <button
  onClick={handleSaveOptions}
  className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
>
  Save Options
</button>
      </div>
    </div>
  );
}
