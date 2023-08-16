export abstract class AbstractMailService {
  abstract sendEmail(to: string, subject: string, text: string): Promise<void>;
}
