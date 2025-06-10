import { connect } from 'mongoose';

export default defineNuxtPlugin({
  name: 'mongo',
  enforce: 'pre', // or 'post'
  async setup(_nuxtApp) {
    const { mongoUri } = useRuntimeConfig();
    await connect(mongoUri);
    console.log('Mongo database connected');
  },
});
