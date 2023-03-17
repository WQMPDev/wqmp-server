import { connect } from '@planetscale/database'
export default async function handler(request, response) {

    const config = {
        url: process.env['DATABASE_URL']
    }

    response.send(config.url ?? 'unknown')

    //const conn = connect(config)
    //const results = await conn.execute('select 1 from Records', [])
    //return res.send(results);
}
