import { Module } from '@nestjs/common';
import { EmailService } from './mail.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        console.log(configService.get<string>('EMAIL_HOST'));
        console.log(configService.get<number>('EMAIL_PORT'));
        console.log(configService.get<string>('EMAIL_USER'));
        console.log(configService.get<string>('EMAIL_PASS'));
        console.log(configService.get<string>('EMAIL_FROM'));
        console.log(configService.get<boolean>('EMAIL_SECURE'));
        return {
          transport: {
            host: configService.get<string>('EMAIL_HOST'),
            port: configService.get<number>('EMAIL_PORT'),
            secure: JSON.parse(configService.get<string>('EMAIL_SECURE') || 'false') as boolean, // true for 465, false for other ports
            auth: {
              user: configService.get<string>('EMAIL_USER'),
              pass: configService.get<string>('EMAIL_PASS'),
            },
          },
          defaults: {
            from: `"Your App" <${configService.get<string>('EMAIL_FROM')}>`,
          },
          template: {
            dir: join(__dirname, 'templates'),
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
