import 'reflect-metadata';
import { createExpressServer } from 'routing-controllers';
import dotenv from 'dotenv';

import { TodoListController } from './controllers';

dotenv.config();

const isDev = process.env.NODE_ENV === 'development';
const port = process.env.PORT || 5000;

const app = createExpressServer({
  cors: true,
  controllers: [TodoListController],
  development: isDev,
});

app.listen(port, () => {
  console.log(`Service is listening on port ${port}`);
});
