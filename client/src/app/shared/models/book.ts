import {IAuthor} from "./author";
import {IGenre} from "./genre";

export interface IBook {
  id: number;
  isbn: string;
  title: string;
  description: string;
  imageUrl: string;
  pages: number;
  price: number;
  publishDate: Date;
  genres: IGenre[];
  authors: IAuthor[];
}
