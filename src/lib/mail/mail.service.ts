import { promises as fs } from 'fs';
import { MailerService } from '@nestjs-modules/mailer';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Handlebars from 'handlebars';

@Injectable()
export class MailService {
  constructor(
    @Inject() private configService: ConfigService,
    private readonly mailService: MailerService
  ) {}

  async renderHtml(fileName: string, payload: Record<string, any>) {
    try {
      const file = await fs.readFile(`src/html/${fileName}`, {
        encoding: 'utf-8',
      });
      const template = Handlebars.compile(file);
      const rendered = template(payload);

      return rendered;
    } catch (error) {
      // TODO: logger
      throw new InternalServerErrorException();
    }
  }

  async send({
    from = `Diaz <${this.configService.get('MAIL_USER')}>`,
    to,
    subject,
    html,
  }: {
    from?: string;
    to: string;
    subject: string;
    html: {
      fileName: string;
      payload: Record<string, any>;
    };
  }) {
    const content = await this.renderHtml(html.fileName, html.payload);

    try {
      await this.mailService.sendMail({
        from,
        to,
        subject,
        html: content,
      });
    } catch (error) {
      // TODO: logger
    }
  }
}
