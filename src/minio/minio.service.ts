import { Injectable } from '@nestjs/common';
import { Client } from 'minio';

@Injectable()
export class MinioService {
  private minioClient: Client;
  constructor() {
    console.log( process.env.MINIO_ENDPOINT)
    this.minioClient = new Client({
      endPoint: 'localhost',
      port: 9000,
      useSSL: false,
      accessKey:'pKcYYJgeXkJfAZBRPgc4',
      secretKey: 'g1Zvr6SkLt2Cc3hA8IJsKPfHcBKC0Qix5PUz29Zq',
    });
  }

  async uploadFile(bucketName: string, file: Express.Multer.File): Promise<string> {
    const fileName = `${Date.now()}_${file.originalname}`;
    
    await this.minioClient.putObject(bucketName, fileName, file.buffer);
    return fileName;
  }
}
