const core = require('@actions/core');
const github = require('@actions/github');

try {    
  const branch = core.getInput('branch');  
  setEnvironment(branch);
}

catch (error) {
  core.setFailed(error.message);
}

function setEnvironment(branchName) 
{
    var branchSuffix = branchName.replace('refs/heads/','').toLowerCase();
    var isFeatureBranch = false;
    var environment = '';
  
    switch (branchSuffix) 
    {
      case 'production':
        environment = 'PRODUCTION';
        break;
      case 'staging':
       environment = 'STAGING';
       break;
      case 'master':
      case 'main':
        environment = 'DEVELOPMENT';
        break;
      default:
       isFeatureBranch = true;
       environment = 'DEVELOPMENT';     
   }
   core.exportVariable('IS_FEATURE_BRANCH', isFeatureBranch);
   core.exportVariable('ENVIRONMENT', environment);

  
}
