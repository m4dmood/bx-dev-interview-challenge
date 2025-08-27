import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export interface IUploadFileDto {
    filename: string;
    size: number;
}

export class UploadFileDto implements IUploadFileDto {
    @IsNotEmpty()
    @IsString()
    filename: string;

    @IsNotEmpty()
    @IsNumber()
    size: number;

    @IsNotEmpty()
    @IsString()
    s3Key: string;

    constructor(
        filename: string,
        size: number,
        s3Key: string
    ) {
        this.filename = filename;
        this.size = size;
        this.s3Key = s3Key;
    }
}