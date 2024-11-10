// testSetup.js
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

let serverProcess;

export const startServer = async () => {
  serverProcess = exec('cross-env NODE_ENV=test node index.js');
  await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait for the server to start
};

export const stopServer = async () => {
  if (serverProcess) {
    serverProcess.kill();
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for the server to stop
  }
};