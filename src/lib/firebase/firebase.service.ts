import { Injectable } from '@nestjs/common';
import * as firebase from 'firebase-admin';
import { Messaging } from 'firebase-admin/lib/messaging/messaging';
import {
  MulticastMessage,
  Notification,
} from 'firebase-admin/lib/messaging/messaging-api';
import { LoggerService } from '../logger/logger.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FirebaseService {
  private messaging: Messaging;

  constructor(
    private readonly configService: ConfigService,
    private readonly loggerService: LoggerService
  ) {
    firebase.initializeApp({
      credential: firebase.credential.cert(
        configService.getOrThrow('FIREBASE_SDK_LOCATION')
      ),
    });

    this.messaging = firebase.messaging();
  }

  async sendMessage(tokens: string[], notification: Notification) {
    console.log(tokens);
    console.log(notification);
    const message: MulticastMessage = {
      notification,
      tokens,
    };

    try {
      const result = await this.messaging.sendEachForMulticast(message);
      console.log(JSON.stringify(result, null, 3));
      return result;
    } catch (err) {
      this.loggerService.error(err);
      throw err;
    }
  }
}
