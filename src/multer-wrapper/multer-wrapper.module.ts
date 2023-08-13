import { Global, Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { FSWrapperModule } from 'src/fs-wrapper/fs-wrapper.module';
import { FSWrapperService } from 'src/fs-wrapper/fs-wrapper.service';

@Global()
@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [FSWrapperModule],
      inject: [FSWrapperService],
      useFactory: (fsWrapperService: FSWrapperService) => ({
        storage: diskStorage({
          destination(req, file, callback) {
            const destination = fsWrapperService.prepareDestination();
            callback(null, destination);
          },
          filename(req, file, callback) {
            const fileName = fsWrapperService.constructFileName(file.mimetype);
            callback(null, fileName);
          },
        }),
      }),
    }),
  ],
  exports: [MulterModule],
})
export class MulterWrapperModule {}
