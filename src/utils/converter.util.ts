export const mbToBytes = (mb: number): number => mb * 1024 * 1024;

export const bytesToMB = (bytes: number): number => bytes / (1024 * 1024);

export const getMinioFullUrl = (path: string) =>
  `${process.env.MINIO_USESSL == 'true' ? 'https' : 'http'}://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}${path}`;
