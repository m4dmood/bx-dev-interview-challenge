import { BucketService } from '@/services/bucket/bucket.service';
import { FileService } from '@/services/file/file.service';
import { Controller, Get, Header, NotFoundException, Param, Post, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Express, Response } from 'express';
import { UploadFileDto } from '@/dtos/upload.file.dto';
import { FileEntity } from '@/entities/file.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';

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

    @UseGuards(AuthGuard('jwt'))
    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async upload(@UploadedFile() file: Express.Multer.File) {
        const s3Key = `${uuidv4()}-${file.originalname}`;
        await this.bucketService.uploadFile(s3Key, file.buffer);

        const dto = new UploadFileDto(file.originalname, file.size, s3Key);
        const saved = await this.fileService.save(dto, s3Key);

        return { success: true, message: 'File uploaded', s3Key, file: saved };
    }

    @UseGuards(AuthGuard('jwt'))
    @Get(':id/download')
    @Header('Content-Type', 'application/octet-stream')
    async downloadFile(@Param('id') id: string, @Res() res: Response) {
        const file = await this.fileService.findByKey(id);
        if (!file) {
            throw new NotFoundException('File not found');
        }

        const { stream, contentType, contentLength } =
        await this.bucketService.getFile(file.s3Key);

        res.set({
            'Content-Type': contentType || 'application/octet-stream',
            'Content-Disposition': `attachment; filename="${file.filename}"`,
            'Content-Length': contentLength,
        });

        stream.pipe(res);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('file/:key/hash')
    async getFileHash(@Param('key') key: string) {
        const headParams = {
            Bucket: 'your-bucket',
            Key: key
        };
        
        const result = await this.bucketService.getHash(headParams.Bucket, headParams.Key);
        return {
            hash: result.Metadata['sha256-hash'],
            lastModified: result.LastModified,
            size: result.ContentLength
        };
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('all')
    async retrieveAll(): Promise<FileEntity[]> {
        return await this.fileService.retrieveAll();
    }
}
