import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EventsService } from './events.service.js';
import { UserRegisteredListeners } from './listeners/user-registered.listener.js';

@Module({
  imports: [
    EventEmitterModule.forRoot({
      global: true,
      wildcard: false,
      maxListeners: 20,
      verboseMemoryLeak: true,
    }),
  ],
  providers: [EventsService, UserRegisteredListeners],
  exports: [EventsService],
})
export class EventsModule {}
