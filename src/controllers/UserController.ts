import { Request, Response } from 'express';
import { StorageService } from 'google-storage';
import { UserService } from '../services/UserService';

export class UserController {
  constructor(private userService: UserService, private storageService: StorageService, private directory: string) {
    this.all = this.all.bind(this);
    this.load = this.load.bind(this);
    this.insert = this.insert.bind(this);
    this.update = this.update.bind(this);
    this.patch = this.patch.bind(this);
    this.delete = this.delete.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
    this.deleteFile = this.deleteFile.bind(this);
    this.getImage = this.getImage.bind(this);
  }

  all(req: Request, res: Response) {
    this.userService
      .all()
      .then((users) => res.status(200).json(users))
      .catch((err) => res.status(500).send(err));
  }
  load(req: Request, res: Response) {
    const id = req.params['id'];
    if (!id || id.length === 0) {
      return res.status(400).send('id cannot be empty');
    }
    this.userService
      .load(id)
      .then((user) => {
        if (user) {
          res.status(200).json(user);
        } else {
          res.status(404).json(null);
        }
      })
      .catch((err) => res.status(500).send(err));
  }
  insert(req: Request, res: Response) {
    const user = req.body;
    this.userService
      .insert(user)
      .then((result) => res.status(200).json(result))
      .catch((err) => res.status(500).send(err));
  }
  update(req: Request, res: Response) {
    const id = req.params['id'];
    if (!id || id.length === 0) {
      return res.status(400).send('id cannot be empty');
    }
    const user = req.body;
    if (!user.id) {
      user.id = id;
    } else if (id !== user.id) {
      return res.status(400).send('body and url are not matched');
    }
    this.userService
      .update(user)
      .then((result) => res.status(200).json(result))
      .catch((err) => res.status(500).send(err));
  }
  patch(req: Request, res: Response) {
    const id = req.params['id'];
    if (!id || id.length === 0) {
      return res.status(400).send('id cannot be empty');
    }
    const user = req.body;
    if (!user.id) {
      user.id = id;
    } else if (id !== user.id) {
      return res.status(400).send('body and url are not matched');
    }
    this.userService
      .patch(user)
      .then((result) => res.status(200).json(result))
      .catch((err) => res.status(500).send(err));
  }
  delete(req: Request, res: Response) {
    const id = req.params['id'];
    if (!id || id.length === 0) {
      return res.status(400).send('id cannot be empty');
    }
    this.userService
      .delete(id)
      .then((result) => res.status(200).json(result))
      .catch((err) => res.status(500).send(err));
  }
  uploadFile(req: Request, res: Response) {
    const fileName = req.file.originalname;
    const fileBuffer = req.file.buffer;
    const fileType = req.file.mimetype;
    const type = fileType.split('/')[0];
    const { id } = req.body;
    this.storageService
      .upload(this.directory, fileName, fileBuffer)
      .then((result) => {
        if(type === 'image') {
          this.userService.insertAvt({ id, image: result }).then(() => res.status(200).json(result));
        } else {
          return res.status(200).json(result);
        }
      })
      .catch((err) => {
        console.log(err);
        return res.status(400).send('Upload failed');
      });
  }
  deleteFile(req: Request, res: Response) {
    const { fileName } = req.body;
    this.storageService
      .delete(this.directory, fileName)
      .then((result) => res.status(200).json(result))
      .catch((err) => {
        console.log(err);
        return res.status(400).send('Delete failed');
      });
  }
  getImage(req: Request, res: Response) {
    const { id } = req.params;
    this.userService
      .getAvt(id.toString())
      .then((result) => {
        return res.status(200).json(result);
      })
      .catch((err) => {
        console.log(err);
        return res.status(400).send('id not valid');
      });
  }
}
