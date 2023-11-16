import EasyYandexS3 from 'easy-yandex-s3';

export const s3 = new EasyYandexS3({
  auth: {
    accessKeyId: "YCAJE9TvOCqv3gQKRZkLW3jYx",
    secretAccessKey: "YCMrD8lVLFMYhR4kBeYSrDJPuS8FLNhKTDCEp8f0",
  },
  Bucket: "snappix",
  debug: false,
});