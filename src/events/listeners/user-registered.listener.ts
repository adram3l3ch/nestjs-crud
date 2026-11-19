import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import type { UserRegisteredEventData } from '../events.service.js';

@Injectable()
export class UserRegisteredListeners {
  private readonly logger = new Logger(UserRegisteredListeners.name);

  @OnEvent('user.registered')
  handleUserRegisteredEvent(event: UserRegisteredEventData) {
    this.logger.log(
      `Welcome, ${event.user.name}. Your account created at ${event.timeStamp.toISOString()}`,
    );
  }
}
