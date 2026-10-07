import { randomBytes } from 'crypto';
import { DEFAULT_CONNECTION_CONFIG } from '../Defaults/index.js';
import { generateMessageIDV2, generateWAMessage } from '../Utils/index.js';
import { getUrlInfo } from '../Utils/link-preview.js';
import { isJidGroup } from '../WABinary/index.js';
import { makeCommunitiesSocket } from './communities.js';
import { buildGroupStatusMessage } from './group-status.js';
// export the last socket layer
const makeWASocket = (config) => {
    const newConfig = {
        ...DEFAULT_CONNECTION_CONFIG,
        ...config
    };
    const sock = makeCommunitiesSocket(newConfig);
    const sendGroupStatus = async (jid, content, options = {}) => {
        if (!isJidGroup(jid)) {
            throw new TypeError('sendGroupStatus requires a group JID ending in @g.us');
        }
        const userJid = newConfig.auth.creds.me?.id ?? sock.user?.id;
        if (!userJid) {
            throw new Error('The socket must be logged in before sending a group status');
        }
        const fullMessage = await generateWAMessage(jid, content, {
            logger: newConfig.logger,
            userJid,
            getUrlInfo: text => getUrlInfo(text, {
                thumbnailWidth: newConfig.linkPreviewImageThumbnailWidth,
                fetchOpts: {
                    timeout: 3_000,
                    ...(newConfig.options || {})
                },
                logger: newConfig.logger,
                uploadImage: newConfig.generateHighQualityLinkPreview ? sock.waUploadToServer : undefined
            }),
            getProfilePicUrl: sock.profilePictureUrl,
            getCallLink: sock.createCallLink,
            upload: sock.waUploadToServer,
            mediaCache: newConfig.mediaCache,
            options: newConfig.options,
            messageId: generateMessageIDV2(sock.user?.id),
            ...options
        });
        if (!fullMessage.message) {
            throw new Error('Could not generate the group status message');
        }
        fullMessage.message = buildGroupStatusMessage(fullMessage.message, randomBytes(32));
        await sock.relayMessage(jid, fullMessage.message, {
            messageId: fullMessage.key.id,
            useCachedGroupMetadata: options.useCachedGroupMetadata
        });
        if (newConfig.emitOwnEvents) {
            process.nextTick(async () => {
                await sock.messageMutex.mutex(() => sock.upsertMessage(fullMessage, 'append'));
            });
        }
        return fullMessage;
    };
    return {
        ...sock,
        sendGroupStatus
    };
};
export default makeWASocket;