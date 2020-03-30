const createHandler = require('github-webhook-handler');
const shell = require('shelljs');

var handler = createHandler({
    path: '/webhook',
    secret: "MY_SECRET"
})
MY_SECRET = "The one we just updated in the github webhook section"

handler.on('pull_request', function (event) {
    const repository = event.payload.repository.name;
    const action = event.payload.action;
    console.log('Received a Pull Request for %s to %s', repository, action);
    if (repository === REPO_NAME && action === 'closed') {
        // By now we can pull the latest code by executing below script
        shell.cd('..');
        shell.exec('scripts/pullcode')
    }
    //Call a function to install chaincode to the peers
});
handler.on('error', function (err) {
    console.error('Error has occurred:', err.message)
})