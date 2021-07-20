import { DeleteObjectCommand, PutObjectCommand, S3Client} from '@aws-sdk/client-s3';

export interface AWSConfig {
  region: string;
  access_key_id: string;
  secret_access_key: string;
}
export interface StorageConfig {
  bucket?: string; // bucket name
  public?: boolean;
  /*
  allUsersAreReader?: boolean;
  allAuthenticatedUsersReader?: boolean;
  allAuthenticatedUsersWriter?: boolean;
  */
}

export interface StorageService {
  upload(directory: string, name: string, data: string | Buffer): Promise<string>;
  delete(directory: string, name: string): Promise<boolean>;
}
export class SimpleStorageService implements StorageService {
  constructor(private s3Client: S3Client, private config: StorageConfig) {
    this.upload = this.upload.bind(this);
    this.delete = this.delete.bind(this);
  }
  upload(directory: string, name: string, data: string|Buffer): Promise<string> {
    let key = name;
    if (directory && directory.length > 0) {
      key = directory + '/' + name;
    }
    const i = {
      Bucket: this.config.bucket,
      Key: key,
      Body: data
    };
    const p = new PutObjectCommand(i);
    return this.s3Client.send(p).then(r => JSON.stringify(r));
  }
  delete(directory: string, name: string): Promise<boolean> {
    let key = name;
    if (directory && directory.length > 0) {
      key = directory + '/' + name;
    }
    const i = {
      Bucket: this.config.bucket,
      Key: key
    };
    const p = new DeleteObjectCommand(i);
    return this.s3Client.send(p).then(r => true);
  }
}
