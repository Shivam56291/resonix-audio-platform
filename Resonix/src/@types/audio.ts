import { categoriesTypes } from "@utils/categories";

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
