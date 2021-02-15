const core = require('@actions/core');
const github = require('@actions/github');

try {    
  const branch = core.getInput('branch');

  const environment = 'development';

  if(branch.includes('staging'))
    environment = 'staging'

  else if (branch.includes('production'))
    environment = 'production'
 
   
  console.log(github);

} 
catch (error) {
  core.setFailed(error.message);
}