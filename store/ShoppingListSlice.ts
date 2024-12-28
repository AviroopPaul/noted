import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the shape of a single item in our shopping list
interface Item {
  id: number;
  name: string;
  category: string;
  quantity: number;
  bought: boolean;
}

// Define the shape of our entire state slice
interface ShoppingListState {
  items: Item[];
}

// Set up the initial state for this slice
const initialState: ShoppingListState = {
  items: [],
};

// Create a slice - this is where we define our state and actions
const shoppingListSlice = createSlice({
  name: "shoppingList", // Unique name for this slice
  initialState,
  // Reducers are pure functions that specify how state changes
  reducers: {
    // Each reducer receives current state and an action
    addItem: (
      state,
      action: PayloadAction<{
        name: string;
        category: string;
        quantity: number;
      }>
    ) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers
      // It actually doesn't mutate the state because it uses Immer under the hood
      state.items.push({
        id: Date.now(),
        name: action.payload.name,
        category: action.payload.category,
        quantity: action.payload.quantity,
        bought: false,
      });
    },
    toggleBought: (state, action: PayloadAction<number>) => {
      const item = state.items.find((item) => item.id === action.payload);
      if (item) item.bought = !item.bought;
    },
    // This reducer removes an item from the shopping list by filtering out the item with the matching id
    // It takes a number parameter (the item id) and returns a new array without that item
    // Example: deleteItem(123) would remove the item with id 123 from the list
    deleteItem: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
  },
});

// Export the action creators and reducer
export const { addItem, toggleBought, deleteItem } = shoppingListSlice.actions;
// The .reducer property contains the main reducer function that handles all state updates
// It combines all the individual case reducers (addItem, toggleBought, deleteItem) into a single reducer
// This reducer function takes the current state and an action, and returns the new state
// When we dispatch actions, this reducer determines how to update the state based on the action type
export default shoppingListSlice.reducer;
