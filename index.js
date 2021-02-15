const core = require('@actions/core');
const github = require('@actions/github');

try {    
  const branch = core.getInput('branch');
  const env = core.getInput('env');

  const environment = 'development';

  if(branch.includes('staging'))
    environment = 'staging'

  else if (branch.includes('production'))
    environment = 'production';  


  console.log(core.getState());

  var variablesToLoad = env.split(' ');

  variablesToLoad.forEach((item) => {
     core.exportVariable(item, "test");
     core.setSecret(item);
     console.log("test");
  });
}

catch (error) {
  core.setFailed(error.message);
}