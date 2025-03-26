import pino from 'pino';
export const logger = pino.default({
    transport: {
        target: 'pino-pretty',
    },
    //@ts-ignore
    disabled: !!process.env.NOLOG,
    minLength: 4096, // Buffer antes de escrever
    sync: false, // Logging assíncrono
    level: process.env.PINO_LOG_LEVEL || 'debug',
});
