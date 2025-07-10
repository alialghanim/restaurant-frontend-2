# Restaurant Editor Components

This directory contains all the components related to the restaurant editor functionality, organized into logical sections for better maintainability.

## File Structure

```
src/
├── types/
│   └── restaurant.ts                    # TypeScript interfaces for Restaurant, Category, Item, NewItem
├── hooks/
│   └── useRestaurantData.ts            # Custom hook for data fetching and state management
├── components/
│   └── restaurant-editor/
│       ├── index.ts                    # Barrel exports for all components
│       ├── RestaurantForm.tsx          # Form component for restaurant basic information
│       ├── ItemEditCard.tsx            # Individual item editing card component
│       ├── CategoryCard.tsx            # Category display and management card
│       ├── modals/
│       │   ├── AddCategoryModal.tsx    # Modal for adding new categories
│       │   └── AddItemModal.tsx        # Modal for adding new items
│       └── README.md                   # This documentation file
└── app/admin/dashboard/restaurant-editor/[restaurantId]/
    └── page.tsx                        # Main page component that orchestrates everything
```

## Component Responsibilities

### 1. **Types (`src/types/restaurant.ts`)**
- Defines TypeScript interfaces for all restaurant-related data structures
- Ensures type safety across all components
- Centralized type definitions for easy maintenance

### 2. **Custom Hook (`src/hooks/useRestaurantData.ts`)**
- Manages all data fetching logic
- Handles loading states and error handling
- Provides centralized state management for restaurant, categories, and items
- Reusable across different components

### 3. **RestaurantForm Component**
- Handles restaurant basic information (name, description, location, image)
- Form validation and submission
- Image upload functionality
- Responsive design

### 4. **ItemEditCard Component**
- Individual item editing interface
- Image upload for items
- Category assignment (multiple categories support)
- Quantity management (including unlimited quantity option)
- Save and delete functionality
- Arabic text support

### 5. **CategoryCard Component**
- Simple category display
- Delete functionality
- Clean card-based design

### 6. **Modal Components**
- **AddCategoryModal**: Form for creating new categories
- **AddItemModal**: Form for creating new items with image upload
- Consistent modal design and behavior
- Form validation

### 7. **Main Page Component**
- Orchestrates all components
- Handles authentication
- Manages modal states
- Coordinates data flow between components

## Benefits of This Structure

1. **Separation of Concerns**: Each component has a single responsibility
2. **Reusability**: Components can be easily reused in other parts of the application
3. **Maintainability**: Easy to locate and modify specific functionality
4. **Type Safety**: Centralized type definitions ensure consistency
5. **Testing**: Each component can be tested independently
6. **Code Organization**: Logical grouping makes the codebase easier to navigate

## Usage Example

```tsx
import {
  RestaurantForm,
  ItemEditCard,
  CategoryCard,
  AddCategoryModal,
  AddItemModal
} from "@/components/restaurant-editor";

// Use components in your page
<RestaurantForm 
  restaurant={restaurant}
  onSubmit={handleSubmit}
  // ... other props
/>
```

## Future Improvements

1. **Error Boundaries**: Add error boundaries for better error handling
2. **Loading States**: More granular loading states for individual operations
3. **Optimistic Updates**: Implement optimistic UI updates for better UX
4. **Drag & Drop**: Add drag and drop functionality for item reordering
5. **Bulk Operations**: Add bulk edit/delete functionality
6. **Image Optimization**: Add image compression and optimization
7. **Internationalization**: Add i18n support for multiple languages
