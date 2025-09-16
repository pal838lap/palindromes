const { PalindromeTracker } = require('./dist/lib/palindrome-tracker');

const tracker = new PalindromeTracker();
const pending = tracker.getPalindromesByStatus(['pending', 'not_found'], 10);
console.log('First 10 pending/not_found palindromes:', pending);

const progress = tracker.getProgress();
console.log('Progress counts:', {
  pending: progress.pending,
  notFound: progress.notFound,
  found: progress.found,
  offRoad: progress.offRoad
});