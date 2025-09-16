import { Injectable } from '@nestjs/common';
import { IBucketService } from './bucket.service.interface';
import { S3Client, PutObjectCommand, PutObjectCommandOutput, GetObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'stream';

@Injectable()
export class BucketService implements IBucketService {
    private readonly s3: S3Client;

    constructor() {
        const region = process.env.AWS_REGION;
        const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
        const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
        const endpoint = process.env.S3_ENDPOINT;

        if (!region || !accessKeyId || !secretAccessKey || !endpoint) {
            throw new Error('AWS environment variables are missing!');
        }

        this.s3 = new S3Client({
            region,
            endpoint,
            credentials: {
                accessKeyId,
                secretAccessKey
            },
            forcePathStyle: true,
        });
    }
    
    async uploadFile(s3Key: string, data: Buffer): Promise<PutObjectCommandOutput> {
        const hash = crypto.createHash('sha256').update(file).digest('hex');
        const command = new PutObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME!,
            Key: s3Key,
            Body: data,
            Metadata: {
              'sha256-hash': hash
            }
            });
        return this.s3.send(command);
    }

    async getFile(key: string): Promise<{
      stream: Readable;
      contentType?: string;
      contentLength?: number;
    }> {
      const command = new GetObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
      });

      const response = await this.s3.send(command);

      if (!response.Body || !(response.Body instanceof Readable)) {
        throw new Error('Invalid file stream');
      }

      return {
        stream: response.Body as Readable,
        contentType: response.ContentType,
        contentLength: response.ContentLength,
      };
  }

  async getHash(bucket: string, key: string) {
    const headParams = {
      Bucket: bucket,
      Key: key
    };
    return this.s3.headObject(headParams).promise();
  }
}
