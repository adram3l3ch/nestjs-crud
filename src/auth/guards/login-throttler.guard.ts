import { Injectable } from '@nestjs/common';
import { ThrottlerException, ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class LoginThrottlerGuard extends ThrottlerGuard {
  protected async getTracker(req: Record<string, any>) {
    const email = req?.body?.email || 'anonymous';
    return `login-${email}`;
  }

  //   protected getLimit() {
  //     return Promise.resolve(2);
  //   }

  //   protected getTtl() {
  //     return Promise.resolve(60000);
  //   }

  protected async throwThrottlingException() {
    throw new ThrottlerException(
      'Too many attempts! Please try again after 10 minute',
    );
  }
}
