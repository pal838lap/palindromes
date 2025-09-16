const args = ['--retry-not-found', '--batch-size', '8', '--concurrency', '8'];
console.log('Args:', args);

const options = {
  batchSize: 100,
  maxRetries: 3,
  delay: 800,
  concurrency: 16,
  initOnly: false,
  reset: false,
  status: false,
  test: false,
  retryStatuses: undefined,
};

for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  console.log('Processing arg:', arg);
  
  switch (arg) {
    case '--batch-size':
      options.batchSize = parseInt(args[++i]) || 100;
      break;
    case '--retry-not-found':
      options.retryStatuses = ['not_found', 'pending'];
      console.log('Set retryStatuses to:', options.retryStatuses);
      break;
    case '--concurrency':
      options.concurrency = parseInt(args[++i]) || 16;
      break;
  }
}

console.log('Final options:', options);
