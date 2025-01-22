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
      accessKey:'KQss7NFSfLc2vpuhhLrV',
      secretKey: '2QIvWxlBQ4QOleSuqeIcut9zi8FMhPFsgffVq0ny',
    });
  }

  async uploadFile(bucketName: string, file: Express.Multer.File): Promise<string> {
    const fileName = `${Date.now()}_${file.originalname}`;
    
    await this.minioClient.putObject(bucketName, fileName, file.buffer);
    return fileName;
  }
}
