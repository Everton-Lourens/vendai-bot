interface Client {
   id: string;
   stage: number;
   message: string;
   order: object;
   response: string;
}

export function formatApiResponse({
    status,
    message,
    client = {} as Client,
    errorCode = '',
 }: {
    status: number;
    message: string;
    client?: Client;
    errorCode?: string;
 }): {
    status: number;
    message: string;
    timestamp: string;
    client: Client;
    error_code: string;
 } {
    return {
       status,
       message,
       timestamp: new Date().toISOString(),
       client,
       error_code: errorCode,
    };
 }

