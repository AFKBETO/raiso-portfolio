import { connect } from 'mongoose';

export default defineNuxtPlugin({
  name: 'mongo',
  enforce: 'pre', // or 'post'
  async setup (_nuxtApp) {
    const mongo_uri = process.env.MONGO_URI || '';
    await connect(mongo_uri);
    console.log('Mongo database connected');
  },
})