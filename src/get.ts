import { Bin } from "./types";

const binUrlPattern = /^https:\/\/bin\.scarsz\.me\/(?<uuid>[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})#(?<key>[0-9a-zA-Z]{32})$/;

export function getUrl(url: string) {
    const groups = binUrlPattern.exec(url)?.groups;
    if (!groups) throw new Error("Invalid bin URL");
    return get(groups["uuid"], groups["key"]);
}

export async function get(uuid: string, key: string): Promise<Bin | null> {
    /* fetch */
    let url = `https://bin.scarsz.me/v1/${encodeURIComponent(uuid)}.json`;
    // bypass bin.scarsz.me not allowing CORS in browsers
    if (window) url = `https://corsproxy.io/?${encodeURIComponent(url)}`;
    const res = await fetch(url);
    if (res.status === 404) return null;
    if (res.status !== 200) throw new Error(`Unexpected HTTP status: ${res.status}`);
    const data: Bin = await res.json();

    /* decrypt */
    const cryptoKey = await importDecryptKey(key);
    if (data.description) data.description = await decrypt(data.description, cryptoKey);
    for (const file of data.files) {
        file.name = await decrypt(file.name, cryptoKey);
        file.content = await decrypt(file.content, cryptoKey);
        if (file.description) file.description = await decrypt(file.description, cryptoKey);
        if (file.type) file.type = await decrypt(file.type, cryptoKey);
    }

    return data;
}

function importDecryptKey(key: string) {
    return crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(key),
        { name: "AES-CBC" },
        false,
        ["decrypt"]
    );
}

async function decrypt(b64: string, cryptoKey: CryptoKey) {
    const bytes = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
    const decryptedBytes = await crypto.subtle.decrypt(
        { name: "AES-CBC", iv: bytes.slice(0, 16) },
        cryptoKey,
        bytes.slice(16)
    );
    return new TextDecoder().decode(decryptedBytes);
};
