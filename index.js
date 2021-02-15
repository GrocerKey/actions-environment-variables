const core = require('@actions/core');
const github = require('@actions/github');

try {    
  const branch = core.getInput('branch');

  const environment = 'development';

  if(branch.indexof('staging'))
    environment = 'staging'

  else if (branch.indexof('production'))
    environment = 'production'
 
   
  console.log(env);

} 
catch (error) {
  core.setFailed(error.message);
}