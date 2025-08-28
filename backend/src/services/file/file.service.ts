import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IFileService } from './file.service.interface';
import { UploadFileDto } from '@/dtos/upload.file.dto';
import { Repository } from 'typeorm';
import { FileEntity } from '@/entities/file.entity';

@Injectable()
export class FileService implements IFileService {

    constructor(
        @InjectRepository(FileEntity)
        private readonly fileRepository: Repository<FileEntity>
    ) {}

    async save(payload: UploadFileDto, s3Key: string): Promise<FileEntity> {
        const file = this.fileRepository.create({
            filename: payload.filename,
            size: payload.size,
            s3Key: s3Key,
            uploadedOn: new Date()
        });

        return this.fileRepository.save(file);
    }

    async retrieveAll(): Promise<FileEntity[]> {
        return this.fileRepository.find();
    }

    async findById(id: string): Promise<FileEntity | undefined> {
        const res = await this.fileRepository.findOne({ where: { id } });
        if (res) return res;
    }

    async findByKey(key: string): Promise<FileEntity | undefined> {
        const res = await this.fileRepository.findOne({ where: { s3Key: key } });
        if (res) return res;
    }
}
