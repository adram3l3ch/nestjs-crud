import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { User } from '../auth/entities/user.entity.js';

export interface UserRegisteredEventData {
  user: Pick<User, 'id' | 'name' | 'email'>;
  timeStamp: Date;
}

@Injectable()
export class EventsService {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  emitUserRegistration(user: User) {
    const userRegisteredEventData: UserRegisteredEventData = {
      user: { id: user.id, email: user.email, name: user.name },
      timeStamp: new Date(),
    };

    this.eventEmitter.emit('user.registered', userRegisteredEventData);
  }
}
