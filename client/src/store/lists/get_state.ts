export interface IList {
  id: number;
  title: string;
  icon: string;
  createdAt: string;
  items: any[]
}

export type TListCreate = Omit<IList, 'createdAt' | 'id'>;

export type TListUpdate = Partial<Pick<IList, 'title' | 'items'>>;

export interface IListState {
  currentList: IList | null;
  lists: IList[] | null;
  isLoading: boolean;
}

export const getState = (): IListState => ({
  currentList: null,
  lists: null,
  isLoading: true,
});
