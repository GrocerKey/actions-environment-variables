const core = require('@actions/core');
const github = require('@actions/github');
const path = require('path');
const{ execSync } = require('child_process');
const fs = require('fs');

try {    
  const environment = core.getInput('environment');
  const vars = core.getInput('vars');
  const gitToken = core.getInput('gitToken');
  
  execSync(`git clone https://${gitToken}:x-oauth-basic@github.com/GrocerKey/ci-environment-variables.git`, {
  stdio: [0, 1, 2],
  cwd: path.resolve(__dirname, ''), 
  })
  
  
  let rawdata = fs.readFileSync(path.resolve(__dirname,`ci-environment-variables\\${environment}-environment.txt`));
  let parsedData = JSON.parse(rawdata);
  
  var dict = {};
  parsedData.forEach((item) => {
        dict[key] = value;
   });


  var variables = vars.split(' ');

  variables.forEach((item) => {
     core.exportVariable(item, dict[item]);
  });
}

catch (error) {
  core.setFailed(error.message);
}
