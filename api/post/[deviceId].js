import { connect } from '@planetscale/database'
import { ConfigString } from '../configstring.min.js'
import { SQL } from '../sql.js'

export default async function handler(request, response) {
    try {
        const {deviceId = 'TEST'} = request.query;
        const body = request.body;

        if(!/^[A-Z0-9_-]{,16}$/.test(deviceId) && deviceId !== 'TEST') {
            response.status(400);
            return response.send('400 Bad Id');
        }

        if(!body) {
            response.status(400);
            return response.send('400 No Body')
        }

        const time = +new Date();

        const props = Object.fromEntries(['tds', 'tbd', 'ph', 'fluoro', 'flow'].map(prop => [prop, prop]));
        const data = ConfigString.parse(body);
        
        
        for(const prop of Object.keys(props)) {
            if(!(prop in data)) {
                response.status(400);
                return response.send('400 Invalid Body');
            }
        }
        
        const connection = connect({url: process.env['DATABASE_URL']});
        const result = await SQL `insert into Records(DeviceId,Time,TBD,TDS,pH,Fluoro,Flow) values (${deviceId},${time},${data[props.tbd]},${data[props.tds]},${data[props.ph]},${data[props.fluoro]},${data[props.flow]});`.execute(connection);

        response.status(201);
        return response.send('201 Ok');
    } catch(e) {
        console.error(e);
        response.status(500);
        return response.send('500 Server Error');
    }
}
