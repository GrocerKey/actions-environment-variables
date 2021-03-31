const core = require('@actions/core');
const github = require('@actions/github');
const { Credentials } = require('aws-sdk');
const aws = require('aws-sdk');

try {    
  const branch = core.getInput('branch');  
  const env = core.getInput('env');
  const secrets = core.getInput('secrets');

  const accessKey = core.getInput('aws-access-key-id');
  const secretKey = core.getInput('aws-secret-access-key');
  const roleToAssume = core.getInput('role-to-assume');

  setEnvironment(branch);
  loadVariables(env, secrets);
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
        environment = 'production';
        break;
      case 'staging':
       environment = 'staging';
       break;
      case 'master':
      case 'main':
        environment = 'development';
        break;
      default:
       isFeatureBranch = true;
       environment = 'development';     
   }
   core.exportVariable('IS_FEATURE_BRANCH', isFeatureBranch);
   core.exportVariable('ENVIRONMENT', environment);

  
}

function loadVariables(env, secrets) {
  
  if(env == '')
    return;
  
  var variables = env.split(' ');
  
  if(secrets != '') {
    variables = variables.concat(secrets.split(' '));
  }
  
  variables.forEach(function(part, index, theArray) {
     theArray[index] = `/ci/${theArray[index]}`; 
  });
  
  var ssm = new aws.SSM();

  ssm.getParameters({
    Names: variables,
    WithDecryption: true
  })
  .promise()
  .then((output) => {   
      output.Parameters.forEach((item) => {
        var keyName = item.Name.replace('/ci/','');
        core.exportVariable(keyName, item.Value);
        if(secrets.includes(keyName))
        {
          core.setSecret(item.Value);
        }
      });
  }).catch(function (err) {
      core.setFailed(err);
  });
  
  
}

function  configureAWS(accessKey, secretKey, roleToAssume) {
   
    var region = 'us-east-1';
    const sts = getStsClient(region, accessKey, secretKey);
    
    return sts.assumeRole({
      RoleArn: roleToAssume,      
      RoleSessionName : 'github'      
    })
    .promise()
    .then(function (data) {
      aws.config.update({
         region: region,
         accessKeyId: data.Credentials.AccessKeyId,
         secretAccessKey: data.Credentials.SecretAccessKey,
         sessionToken: data.Credentials.SessionToken,
         httpOptions: {
           xhrAsync: false
         }
      });
    })
    .catch(function (err) {
      core.setFailed(err);
    });
}

function getStsClient(region, accessKey, secretKey) {
    var credentials = new Credentials();
    credentials.accessKeyId = accessKey;
    credentials.secretAccessKey = secretKey

    return new aws.STS({
      credentials : credentials,
      region: region
    });
}
