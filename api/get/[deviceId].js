import { connect } from '@planetscale/database'
import { CSV } from '../csv.min.js'
import { SQL } from '../sql.js'

export default async function handler(request, response) {
    try {
        const {deviceId = 'Sample-Data', after = 0, before = +new Date()} = request.query;

        const connection = connect({url: process.env['DATABASE_URL']});
        const result = await SQL `select * from Records where DeviceId = ${deviceId} and Time > ${+after} and Time < ${+before}`.execute(connection);
        
        const ignoredProps = ['RecordId', 'DeviceId'];

        response.setHeader('Content-Type', 'text/csv');
        
        if(!result.rows?.length) {
            response.status(400);
            return response.send(result.headers.filter(h => !ignoredProps.includes(h)).map(h => h.toLowerCase()).join(','));
        } else {
            response.status(200);
            return response.send(CSV.stringify(result.rows.map(o=>{for(const prop of ignoredProps) delete o[prop]; return o;}), function(key, value) {
                if(key === null) {
                    return value.toLowerCase();
                }
                return value;
            }));
        }
    } catch(e) {
        console.error(e);
        response.status(500);
        return response.send('500 Server Error');
    }
}
