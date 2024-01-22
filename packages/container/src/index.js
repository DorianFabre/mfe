// This file ensures that any required code is imported BEFORE trying to do anything with it
// Otherwise it would throw an error as the code wouldn't be available
// Importing the code as a function - import() - loads it asynchronously
import('./bootstrap');