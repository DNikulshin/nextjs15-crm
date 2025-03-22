export async function checkApiKey(req: Request): Promise<boolean> {
    return req.headers.get('x-api-key') === process.env.NEXT_PUBLIC_API_KEY;
}

export function createResponse(data: unknown, status = 200): Response {
    return new Response(JSON.stringify(data), {
        status,
        headers: { "Content-Type": "application/json" }
    });
}