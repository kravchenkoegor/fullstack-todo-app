import { Response } from 'express';
import {
  BadRequestError,
  BodyParam,
  Delete,
  Get,
  HttpError,
  JsonController,
  Param,
  Post,
  Put,
  QueryParam,
  Res,
} from 'routing-controllers';
import { ListItem } from '@prisma/client';
import { ListService } from '../services';

export interface ITodoListController {
  listService: ListService;
  handleError: (res: Response, error: any) => void;
}

@JsonController('/api')
export class TodoListController implements ITodoListController {
  listService: ListService;

  constructor() {
    this.listService = new ListService();
  }

  handleError(res: Response, error: any) {
    if (error instanceof HttpError && error.httpCode) {
      return res.sendStatus(error.httpCode);
    }

    return res.sendStatus(500);
  }

  @Get('/lists')
  public async getLists(
    @Res() res: Response,
  ) {
    try {
      const lists = await this.listService.getLists();
      return res.json(lists);
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  @Get('/list/:id')
  public async getListById(
    @Param('id') id: number,
    @Res() res: Response,
  ) {
    try {
      const list = await this.listService.getListById(id);
      if (!list) {
        return res.sendStatus(404);
      }

      return res.json(list);
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  @Post('/list')
  public async createList(
    @BodyParam('title') title: string,
    @BodyParam('icon') icon: string,
    @Res() res: Response,
  ) {
    if (!title || title.length > 50 || !icon) {
      throw new BadRequestError();
    }

    try {
      const createdList = await this.listService.createList({
        title,
        icon,
      });
      return res.json(createdList);
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  @Put('/list/:id')
  public async updateList(
    @Param('id') id: number,
    @BodyParam('title') title: string,
    @BodyParam('items') items: ListItem[],
    @Res() res: Response,
  ) {
    if (title?.length > 50) {
      throw new BadRequestError();
    }

    try {
      const updatedList = await this.listService.updateList({
        listId: id,
        data: {
          title,
          items,
        },
      });
      return res.json(updatedList);
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  @Delete('/list/:id')
  public async deleteList(
    @Param('id') id: number,
    @Res() res: Response,
  ) {
    try {
      await this.listService.deleteList(id);
      return res.sendStatus(200);
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  @Put('/todo/:id')
  public async updateTodo(
    @Param('id') id: number,
    @Res() res: Response,
    @BodyParam('done') done: boolean,
  ) {
    try {
      const updatedTodo = await this.listService.updateTodo({
        todoId: id,
        data: {
          done,
        },
      });
      return res.json(updatedTodo);
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  @Delete('/todo')
  public async deleteTodo(
    @QueryParam('ids') ids: string,
    @Res() res: Response,
  ) {
    try {
      const todoIds = ids
        .split(',')
        .map(id => Number(id))
        .filter(id => Boolean(id) && typeof id === 'number');
      await this.listService.deleteTodo(todoIds);
      return res.sendStatus(200);
    } catch (error) {
      return this.handleError(res, error);
    }
  }
}
