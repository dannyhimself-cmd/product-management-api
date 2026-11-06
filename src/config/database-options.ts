function validateDatabaseOptions() {
    const host = process.env.DB_HOST;
    const port = Number(process.env.DB_PORT);
    const username = process.env.DB_USERNAME;
    const password = process.env.DB_PASSWORD;
    const database = process.env.DB_DATABASE;
    if (!host) throw new Error('Host must not empty')
    if (!username) throw new Error('User must not empty')
    if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Invalid port')
    if (!database) throw new Error('Expected a database name')

    return {
        host,
        port,
        username,
        password,
        database,
    }
}
export const getDatabaseOptions = () => {
    return validateDatabaseOptions();
};