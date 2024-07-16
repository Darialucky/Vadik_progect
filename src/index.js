import { setupServer } from './server.js';

import { initMongoConnection } from './db/initMongoConnection.js';
import { createDirIfNotexists } from './utils/createDirIfNotExists.js';
import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from './constants/constans.js';

const bootstrap = async () => {
  await initMongoConnection();
  await createDirIfNotexists(TEMP_UPLOAD_DIR);
  await createDirIfNotexists(UPLOAD_DIR);
  setupServer();
};

bootstrap();
