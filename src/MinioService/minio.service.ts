import { Injectable } from '@nestjs/common';
import { Client } from 'minio';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class MinioService {
  private minioClient: Client;

  constructor() {
    this.minioClient = new Client({
      endPoint: 'localhost',
      port: 9000,
      useSSL: false,
      accessKey: 'UJ1oAt9RHD3XLbiIWPJQ',
      secretKey: 'nBBCnTHPpNQP0Ac6m8EO7ku6qpC1MQWVTPtadNUx',
    });
  }

  async uploadFile(bucketName: string, file: Express.Multer.File) {
    const fileName = `${Date.now()}-${file.originalname}`;
    try {
      await this.minioClient.putObject(bucketName, fileName, file.buffer);
      return fileName;
    } catch (error) {
      console.error('MinIO Upload Error:', error);
      throw new Error('File upload to MinIO failed');
    }
  }
}
