export const logger = (
    type: 'info' | 'error' | 'warn' = 'info',
    ...message: any
) => {
    console[type](message);
}
