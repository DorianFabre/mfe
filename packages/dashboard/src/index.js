// This file is not used by the host (container) app, it is only for development of this app as a standalone item
// It ensures that any required code is imported BEFORE trying to do anything with it
// Otherwise it would throw an error as the code wouldn't be available
// Importing the code as a function - import() - loads it asynchronously
import('./bootstrap');