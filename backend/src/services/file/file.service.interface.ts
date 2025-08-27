import { UploadFileDto } from "@/dtos/upload.file.dto";
import { FileEntity } from "@/entities/file.entity";

export interface IFileService {
    save(payload: UploadFileDto, s3Key: string): Promise<FileEntity>;

    retrieveAll(): Promise<FileEntity[]>;

    findById(id: string): Promise<FileEntity | undefined>;
}