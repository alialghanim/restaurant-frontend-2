export interface Restaurant {
  id: string;
  name: string;
  description?: string;
  location?: string;
  imageUrl?: string;
  address?: string;
  phone?: string;
  email?: string;
  slug?: string;
  openingHours?: {
    [key: string]: {
      open: string;
      close: string;
    };
  };
  paymentSettings?: {
    defaultMethod: "wallet" | "cash" | "card";
    fallbackMethod?: "wallet" | "cash" | "card";
  };
  status?: "active" | "inactive" | "suspended";
  isVerified?: boolean;
  ownerId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Item {
  id: string;
  name: string;
  description?: string;
  price: number;
  quantity: number | null;
  imageUrl?: string;
  file?: File;
  categoryIds: string[];
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}
