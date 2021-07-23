import { Application } from 'express';
import { ApplicationContext } from './context';
import multer from 'multer';

export function route(app: Application, ctx: ApplicationContext): void {
  let upload = multer();
  const user = ctx.userController;
  app.get('/users', user.all);
  app.get('/users/:id', user.load);
  app.post('/users', user.insert);
  app.put('/users/:id', user.update);
  app.patch('/users/:id', user.patch);
  app.delete('/users/:id', user.delete);
  app.post('/uploads', upload.single('file'), user.uploadFile);
}
