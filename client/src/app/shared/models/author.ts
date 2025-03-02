import {IBook} from "./book";

export interface IAuthor {
  id: string;
  name: string;
  surname: string;
  penName?: string;
  imageUrl: string;
  birthDate?: Date;
  country?: string;
  city?: string;
  books: IBook[];
}
