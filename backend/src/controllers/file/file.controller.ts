import { BucketService } from '@/services/bucket/bucket.service';
import { FileService } from '@/services/file/file.service';
import { Controller, Get, Header, NotFoundException, Param, Post, StreamableFile, UploadedFile } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Express } from 'express';
import { UploadFileDto } from '@/dtos/upload.file.dto';

@Controller('file')
export class FileController {
    constructor(
        private readonly bucketService: BucketService,
        private readonly fileService: FileService
    ) {}

    async streamToBuffer(stream: any): Promise<Buffer> {
        const chunks = [];
        for await (const chunk of stream) {
            chunks.push(chunk);
        }
        return Buffer.concat(chunks);
    }

    @Post('upload')
    async upload(@UploadedFile() file: Express.Multer.File) {
        const s3Key = `${uuidv4()}-${file.originalname}`;
        await this.bucketService.uploadFile(s3Key, file.buffer);

        const dto = new UploadFileDto(file.originalname, file.size, s3Key);
        const saved = await this.fileService.save(dto, s3Key);

        return { success: true, message: 'File uploaded', s3Key, file: saved };
    }

    @Get(':id/download')
    @Header('Content-Type', 'application/octet-stream')
    async downloadFile(@Param('id') id: string): Promise<StreamableFile> {
        const file = await this.fileService.findById(id);
        if (!file) {
            throw new NotFoundException('File not found');
        }

        const { stream, contentType, contentLength } =
        await this.bucketService.getFile(file.s3Key);

        return new StreamableFile(stream, {
            type: contentType || 'application/octet-stream',
            disposition: `attachment; filename="${file.filename}"`,
            length: contentLength,
        });
    }

    @Get('all')
    async retrieveAll() {
        return await this.fileService.retrieveAll();
    }
}
