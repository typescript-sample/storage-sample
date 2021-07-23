import { Bucket, MakeFilePrivateOptions } from '@google-cloud/storage';
import { StringMap } from 'services/mongo/mongo';

export interface StorageConfig {
  bucket?: string; // bucket name
  public?: boolean;
  /*
  allUsersAreReader?: boolean;
  allAuthenticatedUsersReader?: boolean;
  allAuthenticatedUsersWriter?: boolean;
  */
}
const m: StringMap = {
  png: 'image/png',
  JPEG: 'video/JPEG',
  mp4: 'video/mp4',
  example: 'video/example',
  quicktime: 'video/quicktime',
  MPV: 'video/MPV',
  H265: 'video/H265',
  mj2: 'video/mj2',
  raw: 'video/raw',
  VP8: 'video/VP8',
  VP9: 'video/VP9',
  AV1: 'video/AV1',
  '3gpp': 'video/3gpp',
  '3gpp2': 'video/3gpp2',
  CelB: 'video/CelB',
  DV: 'video/DV',
  aac: 'audio/aac',
  ac3: 'audio/ac3',
  AMR: 'audio/AMR',
  L8: 'audio/L8',
  L16: 'audio/L16',
  L20: 'audio/L20',
  L24: 'audio/L24',
  LPC: 'audio/LPC',
  MELP: 'audio/MELP',
  MELP600: 'audio/MELP600',
  MELP1200: 'audio/MELP1200',
  MELP2400: 'audio/MELP2400',
  mhas: 'audio/mhas',
  'mobile-xmf': 'audio/mobile-xmf',
  MPA: 'audio/MPA',
  aces: 'image/aces',
  avci: 'image/avci',
  avcs: 'image/avcs',
  avif: 'image/avif',
  bmp: 'image/bmp',
  cgm: 'image/cgm',
  'dicom-rle': 'image/dicom-rle',
  emf: 'image/emf',
  fits: 'image/fits',
  g3fax: 'image/g3fax',
  heic: 'image/heic',
  hej2k: 'image/hej2k',
  hsj2: 'image/hsj2',
  jls: 'image/jls',
  jp2: 'image/jp2',
  jph: 'image/jph',
  jphc: 'image/jphc',
  jpm: 'image/jpm',
  jpx: 'image/jpx',
  jxr: 'image/jxr',
  jxrA: 'image/jxrA',
  jxrS: 'image/jxrS',
  jxs: 'image/jxs',
  jxsc: 'image/jxsc',
  jxsi: 'image/jxsi',
  jxss: 'image/jxss',
  ktx: 'image/ktx',
  ktx2: 'image/ktx2',
  naplps: 'image/naplps',
};
export interface StorageService {
  upload(directory: string, name: string, data: string | Buffer): Promise<string>;
  delete(directory: string, name: string): Promise<boolean>;
}
export function getPublicUrl(bucketName: string, filename: string): string {
  return `https://storage.googleapis.com/${bucketName}/${filename}`;
}
export class GoogleStorageService implements StorageService {
  constructor(private bucket: Bucket, private config: StorageConfig, private map?: StringMap) {
    this.upload = this.upload.bind(this);
    this.delete = this.delete.bind(this);
  }
  upload(directory: string, name: string, data: string | Buffer): Promise<string> {
    let key = name;
    if (directory && directory.length > 0) {
      key = directory + '/' + name;
    }
    const metadata: any = {};
    const i = name.lastIndexOf('.');
    if (i >= 0) {
      const ext = name.substr(i + 1);
      if (this.map && ext.length > 0) {
        let contentType = this.map[ext];
        if (!contentType || contentType.length === 0) {
          contentType = ext;
        }
        if (contentType && contentType.length > 0) {
          metadata.contentType = contentType;
        }
      }
    }
    return new Promise<string>((resolve, reject) => {
      const object = this.bucket.file(key);
      object.save(data, { metadata }, (er1) => {
        if (er1) {
          return reject(er1);
        }
        if (this.config.public) {
          object.makePublic((er2) => {
            if (er2) {
              return reject(er2);
            }
            resolve(getPublicUrl(this.bucket.name, key));
          });
        } else {
          object.makePrivate((er2) => {
            if (er2) {
              return reject(er2);
            }
            resolve(getPublicUrl(this.bucket.name, key));
          });
        }
      });
    });
  }
  delete(directory: string, filename: string): Promise<boolean> {
    let key = filename;
    if (directory && directory.length > 0) {
      key = directory + '/' + filename;
    }
    const object = this.bucket.file(key);
    return new Promise<boolean>((resolve, reject) => {
      object.delete((err) => {
        if (err) {
          return reject(err);
        }
        resolve(true);
      });
    });
  }
}
