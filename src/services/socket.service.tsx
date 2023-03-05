// import { io } from "socket.io-client";
const BASE_URL: any = process.env.NEXT_PUBLIC_API_URL;
// // const BASE_URL = "http://localhost:3054";

// export const _io = io(BASE_URL);

import openSocket from 'socket.io-client';
// import { APP_DOMAIN, API_ENDPOINT } from '../environment';/////
//@ts-ignore
class SocketIO extends openSocket {
    constructor() {
        super(BASE_URL, { transports: ['websocket'] });
    }
}

export const _io = new SocketIO();
