import { Collection, Db, FilterQuery } from 'mongodb';
import { User, UserAvatar } from '../../models/User';
import { deleteById, findOne, findWithMap, insert, patch, update, upsert } from './mongo';

export class MongoUserService {
  private readonly collection: Collection;
  private readonly avtUsercollection: Collection;
  private readonly id = 'id';
  constructor(db: Db) {
    this.collection = db.collection('users');
    this.avtUsercollection = db.collection('avatarusers');
  }

  all(): Promise<User[]> {
    return findWithMap<User>(this.collection, {}, this.id);
  }
  load(id: string): Promise<User> {
    const query: FilterQuery<any> = { _id: id };
    return findOne<User>(this.collection, query, this.id);
  }
  insert(user: User): Promise<number> {
    return insert(this.collection, user, this.id);
  }
  update(user: User): Promise<number> {
    return update(this.collection, user, this.id);
  }
  patch(user: User): Promise<number> {
    return patch(this.collection, user, this.id);
  }
  delete(id: string): Promise<number> {
    return deleteById(this.collection, id);
  }
  insertAvt(avtUser: UserAvatar): Promise<number> {
    return upsert(this.avtUsercollection, avtUser, this.id);
  }
  getAvt(id: string): Promise<string> {
    const query: FilterQuery<any> = { _id: id };
    return findOne<UserAvatar>(this.avtUsercollection, query, this.id).then((result) => {
      return result.image;
    });
  }
}
