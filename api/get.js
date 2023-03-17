import { connect } from '@planetscale/database'
export default async function handler(request, response) {
    console.log(process.env['DATABASE_URL'])
    const config = {
        url: process.env['DATABASE_URL']
    }

    const conn = connect(config)
    const results = await conn.execute('select * from Records', [])
    return response.send(results);
}
