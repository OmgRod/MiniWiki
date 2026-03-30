const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');

const configPath = path.resolve(__dirname, '../miniwiki.config.json');

// Watcher setup
const watcher = chokidar.watch(configPath, { persistent: true });

watcher.on('change', (filePath) => {
  console.log(`Configuration file updated: ${filePath}`);

  // Clear the require cache to reload the updated config
  delete require.cache[require.resolve(configPath)];

  try {
    const updatedConfig = require(configPath);
    console.log('Updated configuration:', updatedConfig);

    // TODO: Add logic to propagate the updated config to the app
  } catch (error) {
    console.error('Failed to reload configuration:', error);
  }
});

console.log(`Watching for changes in ${configPath}`);