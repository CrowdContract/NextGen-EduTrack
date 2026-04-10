import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

export const summarizeProject = createAsyncThunk(
  "ai/summarize",
  async (projectId, thunkAPI) => {
    try {
      const res = await axiosInstance.get(`/ai/summarize/${projectId}`);
      return res.data.data.summary;
    } catch (error) {
      toast.error(error.response?.data?.message || "Summarization failed");
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
);

export const suggestFeedback = createAsyncThunk(
  "ai/suggestFeedback",
  async ({ projectId, type }, thunkAPI) => {
    try {
      const res = await axiosInstance.post(`/ai/feedback/${projectId}`, { type });
      return res.data.data.feedback;
    } catch (error) {
      toast.error(error.response?.data?.message || "AI feedback failed");
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
);

export const sendChatMessage = createAsyncThunk(
  "ai/chat",
  async ({ messages, projectId, selectedFileIds }, thunkAPI) => {
    try {
      const res = await axiosInstance.post("/ai/chat", { messages, projectId, selectedFileIds });
      return res.data.data.reply;
    } catch (error) {
      toast.error(error.response?.data?.message || "Chat failed");
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
);

export const explainCode = createAsyncThunk(
  "ai/explainCode",
  async ({ code, language }, thunkAPI) => {
    try {
      const res = await axiosInstance.post("/ai/explain-code", { code, language });
      return res.data.data.explanation;
    } catch (error) {
      toast.error(error.response?.data?.message || "Code explanation failed");
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
);

export const generateCode = createAsyncThunk(
  "ai/generateCode",
  async ({ prompt, language }, thunkAPI) => {
    try {
      const res = await axiosInstance.post("/ai/generate-code", { prompt, language });
      return res.data.data.code;
    } catch (error) {
      toast.error(error.response?.data?.message || "Code generation failed");
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
);

export const gradeProject = createAsyncThunk(
  "ai/gradeProject",
  async (projectId, thunkAPI) => {
    try {
      const res = await axiosInstance.get(`/ai/grade/${projectId}`);
      return res.data.data.grade;
    } catch (error) {
      toast.error(error.response?.data?.message || "Grading failed");
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
);

export const smartSearch = createAsyncThunk(
  "ai/smartSearch",
  async (query, thunkAPI) => {
    try {
      const res = await axiosInstance.post("/ai/smart-search", { query });
      return res.data.data.projects;
    } catch (error) {
      toast.error(error.response?.data?.message || "Search failed");
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
);

const aiSlice = createSlice({
  name: "ai",
  initialState: {
    summary: null,
    suggestedFeedback: null,
    codeExplanation: null,
    generatedCode: null,
    grade: null,
    searchResults: null,
    chatMessages: [],
    loading: false,
    chatLoading: false,
  },
  reducers: {
    addUserMessage: (state, action) => {
      state.chatMessages.push({ role: "user", content: action.payload });
    },
    clearChat: (state) => { state.chatMessages = []; },
    clearSummary: (state) => { state.summary = null; },
    clearSuggestedFeedback: (state) => { state.suggestedFeedback = null; },
    clearCodeExplanation: (state) => { state.codeExplanation = null; },
    clearGeneratedCode: (state) => { state.generatedCode = null; },
    clearGrade: (state) => { state.grade = null; },
    clearSearchResults: (state) => { state.searchResults = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(summarizeProject.pending, (state) => { state.loading = true; })
      .addCase(summarizeProject.fulfilled, (state, action) => { state.loading = false; state.summary = action.payload; })
      .addCase(summarizeProject.rejected, (state) => { state.loading = false; })

      .addCase(suggestFeedback.pending, (state) => { state.loading = true; })
      .addCase(suggestFeedback.fulfilled, (state, action) => { state.loading = false; state.suggestedFeedback = action.payload; })
      .addCase(suggestFeedback.rejected, (state) => { state.loading = false; })

      .addCase(sendChatMessage.pending, (state) => { state.chatLoading = true; })
      .addCase(sendChatMessage.fulfilled, (state, action) => {
        state.chatLoading = false;
        state.chatMessages.push({ role: "assistant", content: action.payload });
      })
      .addCase(sendChatMessage.rejected, (state) => { state.chatLoading = false; })

      .addCase(explainCode.pending, (state) => { state.loading = true; })
      .addCase(explainCode.fulfilled, (state, action) => { state.loading = false; state.codeExplanation = action.payload; })
      .addCase(explainCode.rejected, (state) => { state.loading = false; })

      .addCase(generateCode.pending, (state) => { state.loading = true; })
      .addCase(generateCode.fulfilled, (state, action) => { state.loading = false; state.generatedCode = action.payload; })
      .addCase(generateCode.rejected, (state) => { state.loading = false; })

      .addCase(gradeProject.pending, (state) => { state.loading = true; })
      .addCase(gradeProject.fulfilled, (state, action) => { state.loading = false; state.grade = action.payload; })
      .addCase(gradeProject.rejected, (state) => { state.loading = false; })

      .addCase(smartSearch.pending, (state) => { state.loading = true; })
      .addCase(smartSearch.fulfilled, (state, action) => { state.loading = false; state.searchResults = action.payload; })
      .addCase(smartSearch.rejected, (state) => { state.loading = false; });
  },
});

export const { addUserMessage, clearChat, clearSummary, clearSuggestedFeedback, clearCodeExplanation, clearGeneratedCode, clearGrade, clearSearchResults } = aiSlice.actions;
export default aiSlice.reducer;
