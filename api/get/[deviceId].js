import { connect } from '@planetscale/database'
import { CSV } from '../csv.min.js'
import { SQL } from '../sql.js'

export default async function handler(request, response) {
    const {deviceId = 'Sample-Data'} = request.query;

    const connection = connect({url: process.env['DATABASE_URL']});
    const result = await SQL `select * from Records where DeviceId = ${deviceId}`.execute(connection);
    
    const ignoredProps = ['RecordId', 'DeviceId'];

    response.setHeader('Content-Type', 'text/csv');
    
    if(!result.rows?.length) {
        return response.send(result.headers.filter(h => !ignoredProps.includes(h)).map(h => h.toLowerCase()).join(','));
    } else {
        return response.send(CSV.stringify(result.rows.map(o=>{for(const prop of ignoredProps) delete o[prop]; return o;}), function(key, value) {
            if(key === null) {
                return value.toLowerCase();
            }
            return value;
        }));
    }
}
