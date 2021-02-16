const core = require('@actions/core');
const github = require('@actions/github');
const path = require('path');
const{ execSync } = require('child_process');
const fs = require('fs');

try {    
  const env = core.getInput('env');
  const vars = core.getInput('vars');
  const gitToken = core.getInput('gitToken');
  
  console.log(github);
  
  execSync(`git clone https://${gitToken}:x-oauth-basic@github.com/GrocerKey/ci-environment-variables.git`, {
  stdio: [0, 1, 2], // we need this so node will print the command output
  cwd: path.resolve(__dirname, ''), // path to where you want to save the file
  })
  
  console.log(environment);
  console.log(`ci-environment-variables\\${env}-environment.txt`);
  
  let rawdata = fs.readFileSync(path.resolve(__dirname,`ci-environment-variables\\${env}-environment.txt`));
  let parsedData = JSON.parse(rawdata);
  console.log(parsedData);


  var variables = vars.split(' ');

  variables.forEach((item) => {
     core.exportVariable(item, "test");
     console.log("test");
  });
}

catch (error) {
  core.setFailed(error.message);
}
