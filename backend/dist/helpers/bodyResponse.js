export function formatApiResponse({ status, message, client = {}, errorCode = '', }) {
    return {
        status,
        message,
        timestamp: new Date().toISOString(),
        client,
        error_code: errorCode,
    };
}
