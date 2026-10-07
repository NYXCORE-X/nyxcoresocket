import type { proto } from '../../WAProto/index.js';
/**
 * Wraps a normal message in WhatsApp's group-status envelope.
 * The message secret belongs to the outer message context.
 */
export declare const buildGroupStatusMessage: (message: proto.IMessage, messageSecret?: Uint8Array) => proto.IMessage;
