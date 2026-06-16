export const ADMIN_BACKGROUND = 'assets/admin-bg.png';

export interface SavedBackground {
  id: string;
  name: string;
  dataUrl: string;
  createdAt: number;
}

export const BACKGROUND_LIBRARY_KEY = 'bb__background-library';
export const MAX_SAVED_BACKGROUNDS = 20;
