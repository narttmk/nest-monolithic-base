import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendWelcomeEmail(to: string, name: string, otpCode: string) {
    try {
      await this.mailerService.sendMail({
        to,
        subject: 'Welcome to Our Platform!',
        template: './welcome', // Tên file template (welcome.hbs)
        context: {
          email: to,
          name,
          appName: this.configService.get<string>('APP_NAME'),
          confirmationLink: `${this.configService.get<string>('APP_URL')}/verify-email?token=${otpCode}`,
        },
      });
      return { success: true };
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }
}
