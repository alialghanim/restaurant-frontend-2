export interface Restaurant {
  id: string;
  name: string;
  description?: string;
  location?: string; // ✅ أضف هذا
  imageUrl?: string; 
  address?: string;
  phone?: string;
  email?: string;
  openingHours?: {
    [key: string]: {
      open: string;
      close: string;
    };
  };
  createdAt: string;
  updatedAt: string;
}
