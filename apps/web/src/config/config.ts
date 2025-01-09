interface Config {
  apiUrl: string;
}

const config: Config = {
  /*apiUrl: 'http://localhost:3000' // Default development URL */
  apiUrl: 'https://roisalen.no/rest'
};

// Override with production URL if needed
if (window.location.hostname !== 'localhost') {
  // Remove the port number for production and use /rest path
  config.apiUrl = `${window.location.protocol}//${window.location.hostname}/rest`;
}

export default config; 