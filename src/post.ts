import { BinInit } from "./types";

/** Encrypts and posts a bin. */
export async function post(data: BinInit) {
    const payload = structuredClone(data);

    /* encrypt */
    const key = generateKey();
    const cryptoKey = await importEncryptKey(key);
    if (payload.description) payload.description = await encrypt(payload.description, cryptoKey);
    for (const file of payload.files) {
        file.name = await encrypt(file.name, cryptoKey);
        file.content = await encrypt(file.content, cryptoKey);
        if (file.description) file.description = await encrypt(file.description, cryptoKey);
        if (file.type) file.type = await encrypt(file.type, cryptoKey);
    }

    /* post */
    const res = await fetch("https://bin.scarsz.me/v1/post", { method: "POST", body: JSON.stringify(payload) });
    if (res.status !== 200) throw new Error(`Unexpected HTTP status: ${res.status}`);
    const uuid: string = (await res.json())["bin"];

    return {
        uuid, key,
        url: `https://bin.scarsz.me/${uuid}#${key}`
    };
}

function generateKey() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    const randBytes = new Uint8Array(32);
    crypto.getRandomValues(randBytes);

    let key = "";
    for (let i = 0; i < 32; i++) {
        key += chars[randBytes[i] % chars.length];
    }

    return key;
}

function importEncryptKey(key: string) {
    return crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(key),
        { name: "AES-CBC" },
        false,
        ["encrypt"]
    );
}

async function encrypt(txt: string, cryptoKey: CryptoKey) {
    let iv = new Uint8Array(16);
    crypto.getRandomValues(iv);

    const encrypted = await crypto.subtle.encrypt(
        { name: "AES-CBC", iv },
        cryptoKey,
        new TextEncoder().encode(txt)
    );

    return btoa(String.fromCharCode(...iv, ...(new Uint8Array(encrypted))));
}
