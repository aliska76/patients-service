export function getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
        return error.message;
    }

    if (typeof error === 'string') {
        return error;
    }

    if (error && typeof error === 'object' && 'message' in error) {
        return String(error.message);
    }

    return 'Unknown error';
}

export function getErrorStack(error: unknown): string | undefined {
    if (error instanceof Error && error.stack) {
        return error.stack;
    }
    return undefined;
}

export function logError(logger: any, error: unknown, context?: string): void {
    const message = getErrorMessage(error);
    const stack = getErrorStack(error);

    if (context) {
        logger.error(`[${context}] ${message}`);
    } else {
        logger.error(message);
    }

    if (stack) {
        logger.debug(stack);
    }
}