export interface MailTemplateOptions {
  to: string;
  subject: string;
  template: string; // tên file .hbs (không có đuôi)
  context?: Record<string, any>; // dữ liệu truyền vào template
  attachments?: {
    filename: string;
    path: string;
  }[];
}
