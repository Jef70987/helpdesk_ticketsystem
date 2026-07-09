// src/plugins/Greetings.js

/**
 * Get a greeting based on the time of day
 * @returns {string} Greeting message
 */
export const getGreeting = () => {
  const hour = new Date().getHours();
  
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  if (hour < 21) return 'Good Evening';
  return 'Good Night';
};

/**
 * Get a personalized greeting with the user's name
 * @param {string} name - User's name
 * @returns {string} Personalized greeting
 */
export const getPersonalizedGreeting = (name) => {
  const greeting = getGreeting();
  return name ? `${greeting}, ${name}` : greeting;
};

/**
 * Get a random motivational quote
 * @returns {string} Random quote
 */
export const getRandomQuote = () => {
  const quotes = [
    'Stay positive, work hard, make it happen.',
    'The best way to predict the future is to create it.',
    'Success is not final, failure is not fatal.',
    'Every day is a new beginning.',
    'Believe you can and you are halfway there.',
    'Your limitation—it\'s only your imagination.',
    'Push yourself, because no one else is going to do it for you.',
    'Great things never come from comfort zones.',
    'Dream it. Wish it. Do it.',
    'Success doesn\'t just find you. You have to go out and get it.',
  ];
  return quotes[Math.floor(Math.random() * quotes.length)];
};