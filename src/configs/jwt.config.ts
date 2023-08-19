import { JwtModuleAsyncOptions } from '@nestjs/jwt';
import { ConfigWrapperModule } from 'src/config-wrapper/config-wrapper.module';
import { ConfigWrapperService } from 'src/config-wrapper/config-wrapper.service';

export const jwtModuleAsyncOptions: JwtModuleAsyncOptions = {
  global: true,
  imports: [ConfigWrapperModule],
  inject: [ConfigWrapperService],
  useFactory: (configWrapperService: ConfigWrapperService) => ({
    secret: configWrapperService.JWT_SECRET,
  }),
};
