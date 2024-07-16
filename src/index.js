import { setupServer } from './server.js';

import { initMongoConnection } from './db/initMongoConnection.js';

const getContacts = async () => {
  await initMongoConnection();
  setupServer();
};

getContacts();
