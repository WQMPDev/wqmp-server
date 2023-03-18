export function SQL(strings, ...args) {
    return {
        execute(connection) {
            return connection.execute(strings.join('?'), args);
        }
    }
}