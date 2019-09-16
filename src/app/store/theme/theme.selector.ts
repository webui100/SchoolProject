import { State as AppState } from '../index';

export const selectThemeName = (state: AppState) => state.theme.themeName;