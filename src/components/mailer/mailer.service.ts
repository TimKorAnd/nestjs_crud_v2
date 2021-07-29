import { Injectable } from '@nestjs/common';
import { InjectSendGrid, SendGridService } from '@ntegral/nestjs-sendgrid';
import { app } from '../../main';

@Injectable()
export class MailerService {
  public constructor(
    @InjectSendGrid() private readonly client: SendGridService,
  ) {}

  async send(user, token) {
    const url = (await app.getUrl()) + '/auth/confirm/' + token;
    const msg = {
      to: 'timkorand+1@gmail.com',
      from: 'timkorand+sendgrip@gmail.com', // Use the email address or domain you verified above
      subject: 'Sending with Twilio SendGrid is Fun',
      text: 'and easy to do anywhere, even with Node.js',
      html: `<strong>and easy to do anywhere, even with Node.js
            <a href="${url}">confirm signup</a>></strong>`,
    };
    console.log(url); // mailer: Your account is temporarily under review. Please contact Support to regain access.
    // this.client.send(msg); // TODO Please contact Support to regain access.

    return true;
  }
}
