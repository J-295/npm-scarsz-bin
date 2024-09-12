export type Bin = {
    /** Number of GET requests made to this bin. */
    hits: number;
    /** Information about the bin server. */
    server: {
        /** Bin server's version. */
        version: string;
        /** Bin server's uptime in milliseconds. */
        uptime: number;
    };
    /** Milliseconds taken by the server to serialize the response. */
    generationTime: number;
    /** Bin files. */
    files: {
        /** File name. */
        name: string;
        /** Optional file description. */
        description?: string;
        /** File UUID. */
        id: string;
        /** File MIME type. If not defined, the view page defaults to `application/octet-stream`. */
        type?: string;
        /** File content. */
        content: string;
    }[];
    /** Optional bin description. */
    description?: string;
    /**
     * Bin expiration time in minutes.
     * - Negative number = minutes since creation.
     * - Positive number = minutes since last access.
     * - A default value is used if this isn't specified when uploading.
     */
    expiration: number;
    /** Bin UUID. */
    id: string;
    /** Bin creation time (milliseconds since Unix Epoch). */
    time: number;
};
