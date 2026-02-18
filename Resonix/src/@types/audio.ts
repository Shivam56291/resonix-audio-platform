import { categoriesTypes } from '@utils/categories';

export interface AudioData {
  id: string;
  title: string;
  about: string;
  category: categoriesTypes;
  poster?: string;
  file: string;
  owner: {
    id: string;
    name: string;
  };
}

export interface Playlist {
  id: string;
  title: string;
  itemsCount: number;
  visibility: 'public' | 'private';
}

export interface CompletePlaylist extends Playlist {
  id: string;
  title: string;
  audios: AudioData[];
}

export interface HistoryAudio {
  audioId: string;
  date: string;
  id: string;
  title: string;
}

export interface History {
  date: string;
  audios: HistoryAudio[];
}