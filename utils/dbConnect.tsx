import mongoose from 'mongoose';

const MONGODB_URI =
    process.env.MONGODB_URI ||
    'mongodb+srv://ilce:xnz0zSD9PHRuLgIF@cluster0.h4skxuj.mongodb.net/loobr-v2?retryWrites=true&w=majority';
console.log(MONGODB_URI);
/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */

var global: any = typeof global !== 'undefined' ? global : {};

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false
        };

        cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
            return mongoose;
        });
    }
    cached.conn = await cached.promise;
    return cached.conn;
}

export default dbConnect;
