const core = require('@actions/core');
const github = require('@actions/github');

try {    
  const environment = core.getInput('environment');
  const vars = core.getInput('vars');
  const gitToken = core.getInput('gitToken');

  var variables = vars.split(' ');

  variables.forEach((item) => {
     core.exportVariable(item, "test");
     console.log("test");
  });
}

catch (error) {
  core.setFailed(error.message);
}
