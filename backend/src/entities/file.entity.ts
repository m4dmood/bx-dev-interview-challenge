import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export interface IFileEntity {
    data?: BinaryType;
    filename: string;
    size: number;
    s3Key: string;
}

@Entity('file')
export class FileEntity implements IFileEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    filename: string;

    @Column()
    size: number;

    @Column()
    s3Key: string;
}