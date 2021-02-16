const core = require('@actions/core');
const github = require('@actions/github');
const path = require('path');
const{ execSync } = require('child_process');

try {    
  const environment = core.getInput('environment');
  const vars = core.getInput('vars');
  const gitToken = core.getInput('gitToken');
  
  
  execSync(`git clone https://${gitToken}:x-oauth-basic@github.com/GrocerKey/dev-credentials.git`, {
  stdio: [0, 1, 2], // we need this so node will print the command output
  cwd: path.resolve(__dirname, ''), // path to where you want to save the file
  })

  var variables = vars.split(' ');

  variables.forEach((item) => {
     core.exportVariable(item, "test");
     console.log("test");
  });
}

catch (error) {
  core.setFailed(error.message);
}
