const { exec } = require('child_process');
const path = require('path');

// Change the working directory to the backend directory
const backendDir = path.join(__dirname, 'phonebook_backend');

// Command to run the backend server with npm
const command = 'npm run dev';

exec(command, { cwd: backendDir }, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error starting the backend server: ${error.message}`);
    return;
  }

  if (stderr) {
    console.error(`Backend server stderr: ${stderr}`);
    return;
  }

  console.log(`Backend server stdout: ${stdout}`);
});
