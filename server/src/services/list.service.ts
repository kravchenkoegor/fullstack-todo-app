import {
  List,
  ListItem,
  PrismaClient,
} from '@prisma/client';
import { NotFoundError } from 'routing-controllers';

export type TListCreate = Omit<List, 'createdAt' | 'id'>;

export type TListUpdate = Partial<Pick<List, 'title'>> & { items?: ListItem[] };

export type TTodoCreate = Omit<ListItem, 'createdAt' | 'id' | 'listId'>;

export type TTodoUpdate = Partial<Pick<ListItem, 'title' | 'done'>>;

export interface IListService {
  getLists: () => Promise<List[] | undefined>;
  createList: (data: TListCreate) => Promise<List | undefined>;
  updateList: (
    { listId, data }:
    { listId: List['id']; data: TListUpdate; }
  ) => Promise<void>;
  deleteList: (listId: number) => Promise<void>;
}

export class ListService implements IListService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  private async checkIfListExists(listId: List['id']) {
    const count = await this.prisma.list.count({
      where: { id: listId },
    });
    return count > 0;
  }

  private async checkIfTodoExists(todoId: ListItem['id']) {
    const count = await this.prisma.listItem.count({
      where: { id: todoId },
    });
    return count > 0;
  }

  public async getLists() {
    const lists = await this.prisma.list.findMany({
      where: {},
    });
    return lists;
  }

  public async getListById(listId: List['id']) {
    const list = await this.prisma.list.findUnique({
      where: {
        id: listId,
      },
      include: {
        items: {
          select: {
            id: true,
            title: true,
            done: true,
            createdAt: true,
          },
        },
      },
    });
    return list;
  }

  public async createList(data: TListCreate) {
    const createdList = await this.prisma.list.create({ data });
    return createdList;
  }

  public async updateList(
    { listId, data }:
    { listId: List['id']; data: TListUpdate; },
  ) {
    const listExists = await this.checkIfListExists(listId);
    if (!listExists) {
      throw new NotFoundError();
    }

    if (data.items?.length) {
      await this.prisma.$transaction(
        data.items.map((item) => {
          const { id, ...todo } = item;
          return this.prisma.listItem.upsert({
            where: { id: id ?? -1 },
            update: {
              title: todo.title,
            },
            create: {
              title: todo.title,
              done: false,
              createdAt: todo.createdAt,
              list: {
                connect: {
                  id: listId,
                },
              },
            },
          });
        }),
      );
    }

    if (data.title) {
      await this.prisma.list.update({
        where: {
          id: listId,
        },
        data: {
          title: data.title,
        },
      });
    }
  }

  public async deleteList(listId: List['id']) {
    const listExists = await this.checkIfListExists(listId);
    if (!listExists) {
      throw new NotFoundError();
    }

    await this.prisma.$transaction([
      this.prisma.listItem.deleteMany({
        where: { listId },
      }),
      this.prisma.list.delete({
        where: { id: listId },
      }),
    ]);
  }

  public async updateTodo(
    { todoId, data }:
    { todoId: ListItem['id']; data: { done: boolean; }; },
  ) {
    const todoExists = await this.checkIfTodoExists(todoId);
    if (!todoExists) {
      throw new NotFoundError();
    }

    const updatedTodo = await this.prisma.listItem.update({
      where: { id: todoId },
      data,
    });
    return updatedTodo;
  }

  public async deleteTodo(todoIds: Array<ListItem['id']>) {
    // const todoExists = await this.checkIfTodoExists(todoId);
    // if (!todoExists) {
    //   throw new NotFoundError();
    // }

    await this.prisma.$transaction(
      todoIds.map(id => {
        return this.prisma.listItem.delete({
          where: { id },
        });
      }),
    );
  }
}
