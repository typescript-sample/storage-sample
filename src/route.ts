import { Application } from 'express';
import multer from 'multer';
import { ApplicationContext } from './context';

export function route(app: Application, ctx: ApplicationContext): void {
  const upload = multer();
  const user = ctx.userController;
  app.get('/users', user.all);
  app.get('/users/:id', user.load);
  app.post('/users', user.insert);
  app.put('/users/:id', user.update);
  app.patch('/users/:id', user.patch);
  app.delete('/users/:id', user.delete);
  app.post('/uploads', upload.single('file'), user.uploadFile);
  app.get('/users/image/:id', user.getImage);
}
