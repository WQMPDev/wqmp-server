const { connect } = await import('@planetscale/database')
export default async function handler(req, res) {

    const config = {
        url: process.env['DATABASE_URL']
    }

    const conn = connect(config)
    const results = await conn.execute('select 1 from Records', [])
    return res.send(results);
}
