import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { Page } from "@/types";

interface PagesState {
  pages: Page[];
  selectedPageId: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: PagesState = {
  pages: [],
  selectedPageId: null,
  loading: false,
  error: null,
};

export const fetchPages = createAsyncThunk("pages/fetchPages", async () => {
  const response = await fetch("/api/pages");
  const data = await response.json();
  if (!response.ok) throw new Error(data.error);
  return data;
});

export const createPage = createAsyncThunk(
  "pages/createPage",
  async (page: Partial<Page>) => {
    const response = await fetch("/api/pages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(page),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data;
  }
);

export const updatePage = createAsyncThunk(
  "pages/updatePage",
  async ({ id, ...updates }: { id: string } & Partial<Page>) => {
    const response = await fetch(`/api/pages/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data;
  }
);

export const deletePage = createAsyncThunk(
  "pages/deletePage",
  async (id: string) => {
    const response = await fetch(`/api/pages/${id}`, {
      method: "DELETE",
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return id;
  }
);

export const pagesSlice = createSlice({
  name: "pages",
  initialState,
  reducers: {
    selectPage: (state, action) => {
      state.selectedPageId = action.payload;
    },
    togglePageExpand: (state, action) => {
      const page = state.pages.find((p) => p._id === action.payload);
      if (page) {
        page.isExpanded = !page.isExpanded;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPages.fulfilled, (state, action) => {
        state.loading = false;
        state.pages = action.payload;
      })
      .addCase(fetchPages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch pages";
      })
      .addCase(createPage.fulfilled, (state, action) => {
        state.pages.unshift(action.payload);
        state.selectedPageId = action.payload._id;
      })
      .addCase(updatePage.fulfilled, (state, action) => {
        const index = state.pages.findIndex(
          (p) => p._id === action.payload._id
        );
        if (index !== -1) {
          state.pages[index] = action.payload;
        }
      })
      .addCase(deletePage.fulfilled, (state, action) => {
        state.pages = state.pages.filter((p) => p._id !== action.payload);
        if (state.selectedPageId === action.payload) {
          state.selectedPageId = state.pages[0]?._id || null;
        }
      });
  },
});

export const { selectPage, togglePageExpand } = pagesSlice.actions;
export default pagesSlice.reducer;
