import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface NotesState {
  notes: Note[];
  selectedNoteId: string | null;
}

const initialState: NotesState = {
  notes: [],
  selectedNoteId: null,
};

const notesSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    addNote: (
      state,
      action: PayloadAction<{ title: string; content: string }>
    ) => {
      const newNote = {
        id: Date.now().toString(),
        title: action.payload.title,
        content: action.payload.content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      state.notes.unshift(newNote);
      state.selectedNoteId = newNote.id;
    },
    updateNote: (
      state,
      action: PayloadAction<{ id: string; title: string; content: string }>
    ) => {
      const note = state.notes.find((note) => note.id === action.payload.id);
      if (note) {
        note.title = action.payload.title;
        note.content = action.payload.content;
        note.updatedAt = new Date().toISOString();
      }
    },
    deleteNote: (state, action: PayloadAction<string>) => {
      state.notes = state.notes.filter((note) => note.id !== action.payload);
      if (state.selectedNoteId === action.payload) {
        state.selectedNoteId = state.notes[0]?.id || null;
      }
    },
    selectNote: (state, action: PayloadAction<string>) => {
      state.selectedNoteId = action.payload;
    },
  },
});

export const { addNote, updateNote, deleteNote, selectNote } =
  notesSlice.actions;
export default notesSlice.reducer;
