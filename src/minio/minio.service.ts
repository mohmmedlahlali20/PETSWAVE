import { Injectable } from '@nestjs/common';
import { Client } from 'minio';

@Injectable()
export class MinioService {
  private minioClient: Client;
  constructor() {
    // console.log( process.env.MINIO_ENDPOINT)
    this.minioClient = new Client({
      endPoint: '127.0.0.1',
      port: 9000,
      useSSL: false,
      accessKey:'Oq595Jk8Jdlc1hJT6wRS',
      secretKey: 'SjsrZm4DMDZsNhRMlcbZNoTerbuHSy6oxHzFvwsE',
    });
  }

  async uploadFile(bucketName: string, file: Express.Multer.File): Promise<string> {
    const fileName = `${Date.now()}_${file.originalname}`;
    
    await this.minioClient.putObject(bucketName, fileName, file.buffer);
    return fileName;
  }
}
