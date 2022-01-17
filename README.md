# After you git clone the files
"npm install" to download and install required modules.

## How deployment works
The deployment of our web to Heroku happens when we push files to "main" branch in github. Then, Heroku builds website to deploy.

## To develop locally
I made a seperate branch called "local". I modified files to run server and website locally. 
Checkout to the branch "local".
Then, "nodemon server.js" to run server on localhost:3000.
Then, "npm start" to see the webpage.

To set up local mySQL, look at (https://lo-victoria.com/build-mysql-nodejs-crud-app-1-setting-up).
If you have any question about setting up local mySQL, please contact Jae Young Lee.

### deploy-backup branch
It is a backup of the app that we can deploy on Heroku

### Errors with modules
We might encounter errors related to modules when we develop. One way to quick fix is to delete your "node_modules" folder and "package-lock.json" and run "npm install".
