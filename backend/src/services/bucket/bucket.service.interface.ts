import { PutObjectCommandOutput } from "@aws-sdk/client-s3";
import { Readable } from "stream";

export interface IBucketService {
    uploadFile(filename: string, data: Buffer): Promise<PutObjectCommandOutput>;

    getFile(s3Key: string): Promise<{
        stream: Readable;
        contentType?: string;
        contentLength?: number;
      }>;
}