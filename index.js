const core = require('@actions/core');
const github = require('@actions/github');
const path = require('path');
const{ execSync } = require('child_process');
const fs = require('fs');

try {    
  const branch = core.getInput('branch');
  const vars = core.getInput('vars');
  const gitToken = core.getInput('gitToken');
  
  const environment = getEnvironment(branch);
  
  
  execSync(`git clone https://${gitToken}:x-oauth-basic@github.com/GrocerKey/ci-environment-variables.git`, {
  stdio: [0, 1, 2],
  cwd: path.resolve(__dirname, ''), 
  })
  
  
  let rawdata = fs.readFileSync(path.resolve(__dirname,`ci-environment-variables\\${environment}-environment.txt`));
  let parsedData = JSON.parse(rawdata);


  var variables = vars.split(' ');
  
  variables.forEach((item) => {
     if(parsedData.hasOwnProperty(item))
     {
       core.exportVariable(item, parsedData[item]);
     }
  });
  
  core.exportVariable('ENVIRONMENT', environment);  
}

catch (error) {
  core.setFailed(error.message);
}

function getEnvironment(branchName) 
{
  var branchSuffix = branchName.replace('refs/heads/','').toLowerCase();
  switch (branchSuffix) {
    case 'production':
      return 'PRODUCTION';
      break;
    case 'staging':
     return 'STAGING';
     break;
   default:
    return 'DEVELOPMENT';
}

  
}
