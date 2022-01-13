import {
  IList,
  TListCreate,
  TListUpdate,
} from '@/store';
import { AxiosInstance } from 'axios';

export class ListProvider {
  axiosInstance: AxiosInstance;

  constructor(axiosInstance: AxiosInstance) {
    this.axiosInstance = axiosInstance;
  }

  async getLists(): Promise<IList[] | undefined> {
    const { data } = await this.axiosInstance.get('/lists');
    return data;
  };

  async createList(payload: TListCreate): Promise<IList | undefined> {
    const { data } = await this.axiosInstance.post('/list', payload);
    return data;
  };

  async getListById(listId: IList['id']): Promise<IList | undefined> {
    const { data } = await this.axiosInstance.get(`/list/${listId}`);
    return data;
  };

  async updateList(
    { listId, payload }:
    { listId: IList['id'], payload: TListUpdate; },
  ) {
    const { data } = await this.axiosInstance.put(`/list/${listId}`, payload);
    return data;
  }

  async deleteList(listId: IList['id']): Promise<void> {
    await this.axiosInstance.delete(`/list/${listId}`);
  }

  async updateTodo(
    { todoId, done }:
    { todoId: number; done: boolean; },
  ): Promise<void> {
    await this.axiosInstance.put(`/todo/${todoId}`, { done });
  }

  async deleteTodos(todoIds: number[]): Promise<void> {
    await this.axiosInstance.delete(`/todo?ids=${todoIds.join(',')}`);
  }
}
