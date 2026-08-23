import dotenv from 'dotenv';
import { createApp } from './app.js';
import { loadConfig } from './config.js';

dotenv.config({ path: ['.env', '../.env'], override: false });

const config = loadConfig();
const app = createApp({ config });

app.listen(config.PORT, () => {
  console.info(JSON.stringify({ level: 'info', event: 'server_started', port: config.PORT, mode: config.demoMode ? 'demo' : 'supabase' }));
});
