import { createSlice } from '@reduxjs/toolkit'; //next js redux toolkit
export const popupSlice = createSlice({
  name: 'popup',
  initialState: {
    type: '',
    title: '',
    disableClosing: false,
    props: {},
  },
  reducers: {
    setPopup: (state, { payload }) => {
      state.type = payload.type;
      state.title = payload.title;
      state.props = payload.props || {};
      state.disableClosing = payload.disableClosing ?? false;
    },
  },
});
// case under reducers becomes an action
export const { setPopup } = popupSlice.actions;
export default popupSlice.reducer;
