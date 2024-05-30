import {Buffer} from 'buffer/';
import * as Crypto from 'expo-crypto';

global.Buffer = Buffer as any;

global.crypto = {
  getRandomValues: (buffer: any) => Crypto.getRandomValues(buffer),
  randomUUID: () => Crypto.randomUUID() as any,
  getRandomBytes: (length: number) => Crypto.getRandomBytes(length),
} as any;

// MessageChannelPolyfill.js
/* import EventTarget from 'event-target-shim';

class MessageChannelPolyfill {
  constructor() {
    this.port1 = new MessagePortPolyfill();
    this.port2 = new MessagePortPolyfill();
    this.port1._entangleWith(this.port2);
    this.port2._entangleWith(this.port1);
  }
}

class MessagePortPolyfill extends EventTarget {
  constructor() {
    super();
    this._messageQueue = [];
    this._entangledPort = null;
    this._messageQueueProcessing = false;
  }

  postMessage(message) {
    if (this._entangledPort) {
      this._entangledPort._enqueueMessage(message);
    }
  }

  _enqueueMessage(message) {
    this._messageQueue.push(message);
    if (!this._messageQueueProcessing) {
      this._processMessageQueue();
    }
  }

  _processMessageQueue() {
    this._messageQueueProcessing = true;
    while (this._messageQueue.length > 0) {
      const message = this._messageQueue.shift();
      this.dispatchEvent(new MessageEvent('message', {data: message}));
    }
    this._messageQueueProcessing = false;
  }

  _entangleWith(port) {
    this._entangledPort = port;
  }

  start() {}

  close() {}
}

global.MessageChannel = MessageChannelPolyfill;

class MessageEventPolyfill {
  constructor(type, eventInitDict = {}) {
    this.type = type;
    this.data = eventInitDict.data || null;
    this.origin = eventInitDict.origin || '';
    this.lastEventId = eventInitDict.lastEventId || '';
    this.source = eventInitDict.source || null;
    this.ports = eventInitDict.ports || [];
  }
}

global.MessageEvent = MessageEventPolyfill; */
