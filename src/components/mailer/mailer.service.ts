import { Injectable } from '@nestjs/common';

@Injectable()
export class MailerService {
  send(user, token) {
    console.log('mailer sender send');
    console.log(user);
    console.log(token);
    return `
        ${token}
        confirmation send to ${user.email}`;
  }
}
