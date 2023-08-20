import { IUser } from 'src/core/entities/user.entity.abstract';

export abstract class AbstractMessageSenderService {
  abstract sendMessage(
    user: IUser,
    subject: string,
    text: string,
  ): Promise<void>;
}
