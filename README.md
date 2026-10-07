# NYXCORE Socket

**Created by NYXCORE**

NYXCORE Socket is a complete source package for a WhatsApp Web multi-device
socket, with `sendGroupStatus()` added to the socket API. It includes the
connection, authentication, encryption, message, media, group, community,
newsletter, utility, and protocol-buffer source required by the library. It is
not a thin adapter around another installed socket package.

## Source and license

The protocol implementation is based on the upstream Baileys `7.0.0-rc13`
source. NYXCORE's group-status socket method and media relay handling are
included in this package. The upstream MIT copyright and license terms are
preserved in [`LICENSE`](./LICENSE); keep that file with source distributions.

NYXCORE is not affiliated with or endorsed by WhatsApp. WhatsApp and related
marks belong to their respective owners. Use accounts you control, respect
group members' expectations, and follow applicable terms and laws.

## Requirements

- Node.js 20 or newer.
- A WhatsApp account and your own authentication state for the bot.
- A group JID ending in `@g.us` to send a group status.

This repository contains no bot tokens, login credentials, or WhatsApp session
files. Do not upload those files to GitHub.

## Install

**Publication status:** this release is provided as source and a `.tgz` archive;
it has not been published to the public npm registry. Therefore,
`npm install nyxcoresocket` will not install this release yet.

### Install from a GitHub repository

After uploading the package contents to the **root** of a GitHub repository,
install it in the environment that runs your bot:

```sh
npm install github:OWNER/REPOSITORY
```

Replace `OWNER` and `REPOSITORY` with the GitHub account or organization and
repository name.

### Install the included `.tgz` archive

On a machine with Node.js and npm, install the downloaded archive from the bot
project directory:

```sh
npm install ./nyxcoresocket-0.2.0.tgz
```

### Install without a terminal on your phone

A phone can edit the GitHub files and start a deployment, but it cannot run
`npm install` locally. For a bot hosted by a service that deploys from GitHub:

1. Upload this package to its own GitHub repository as described below.
2. Open the bot's `package.json` on GitHub and use **Edit**.
3. Add this property inside the bot's existing `dependencies` object; do not
   replace the rest of `package.json`:

   ```json
   "nyxcoresocket": "github:OWNER/REPOSITORY"
   ```

   Keep the surrounding JSON commas valid, and replace `OWNER` and
   `REPOSITORY`.
4. Commit the change, then trigger a deployment from the bot's hosting
   dashboard. The host installs dependencies as part of its build; check its
   build log for installation errors.

When the bot uses CommonJS `require()`, its host must run Node.js 20.19+,
22.12+, or a newer supported release. If the host does not install GitHub
dependencies during deploy, use its package-management controls or web-based
shell.

### Install from the npm registry

This release must first be published to npm before the registry command below
will work. After it is published under the name `nyxcoresocket`, install it on
the bot host with:

```sh
npm install nyxcoresocket
```

Publishing to npm is a separate release step; uploading the source to GitHub
does not publish it to npm automatically.

## Connect it to an existing bot

Import NYXCORE's socket factory:

```js
const { default: makeWASocket } = require("nyxcoresocket");
```

For CommonJS `require()` with this ESM package, use Node.js 20.19+, 22.12+, or
a newer supported release. On older Node releases, use ESM `import` syntax or
upgrade Node.

Use it with the bot's existing configuration and authentication flow:

```js
const sock = makeWASocket({
  auth: state,
  printQRInTerminal: false,
});
```

The factory returns the library's normal socket methods and events, plus
`sock.sendGroupStatus()`. Existing bot code can keep using its other
authentication or message utilities. If that code imports utilities from
`@whiskeysockets/baileys`, keep that package installed until those imports are
changed too.

## Send a group status

No extra bot command is required. Call the method from the existing status
handler:

```js
const sent = await sock.sendGroupStatus("120363000000000000@g.us", {
  text: "Hello group",
});

console.log("Sent status message:", sent.key.id);
```

Supported content uses the same message generator as the rest of the socket,
including text and media:

```js
await sock.sendGroupStatus(groupJid, {
  image: imageBuffer,
  caption: "A photo for the group",
});

await sock.sendGroupStatus(groupJid, {
  video: videoBuffer,
  caption: "A video for the group",
});
```

The method checks that the destination is a group JID, generates the
group-status envelope and message secret, uploads media through the socket,
and relays the message to that group's participants. It returns the generated
message object and ID.

The destination group determines the audience. WhatsApp membership, privacy,
and client behavior still apply; the method does not add every contact as a
recipient or save anyone's contacts.

## API compatibility

The package preserves the source library's standard exports, including its
socket factory, authentication helpers, message utilities, types, binary
helpers, and WhatsApp protocol definitions. See `src/`, `WAProto/`, and
`lib/` for the full code.

This source is pinned to `7.0.0-rc13` to match projects using that release.
Changing the protocol source version can change APIs and WhatsApp behavior, so
do not upgrade it independently of the bot's compatibility needs.

## Build and tests

On a computer or server with Node.js:

```sh
npm install
npm run build
npm test
npm run test:group-status
```

The group-status unit tests verify the envelope and its 32-byte message
secret. The full source tests cover the library's offline tests. They do not
connect to a live WhatsApp account or prove how a particular phone app renders
a post. That requires a real account and group that you control.

## Upload the source to GitHub

1. Extract the source ZIP.
2. Create an empty GitHub repository.
3. Upload the **contents** of the extracted `nyxcoresocket` folder to the
   repository root. Include `package.json`, `src`, `lib`, `WAProto`,
   `README.md`, and `LICENSE`.
4. Commit the upload.

This can be done from GitHub's website or mobile app. For
`npm install github:OWNER/REPOSITORY` to work, `package.json` must be at the
repository root. Uploading only the ZIP or `.tgz` makes the repository a
file-download location, not an installable GitHub package. The archives can
also be attached to a GitHub release after the source files are uploaded.

## License

MIT. Keep [`LICENSE`](./LICENSE) with the source and package.
