# gdal2postgis

This is a PoC for using GDAL in AWS Lambda. It is a node package that provides asynchronous access to GDAL (Geospatial Data Abstraction Library) functionality using AWS Lambda. It allows you to perform geospatial operations such as reading, writing, and transforming geospatial data without the need to manage a local GDAL installation. 

## Installation

### Local Development
To use `gdal2postgis`, you need to have Node.js installed on your system. The Node version should be ^20.0.0.
You can then install the package use npm, the package required has been set up. However, using following command is only for local developement. For docker, you should only use the dockerfile from the AWS Lambda layer, do not npm install the package.
```
npm install
```
### Docker for aws lambda deployment
All test logic is in index.mjs. Deployment is dependent on the dockerfile and package*.json.
Step 1: Setup aws cli and iam role for aws components
Install aws cli on your local machine. Set up IAM role to operate aws lambda, ECR, S3 and other aws components, and then configure aws cli to use the IAM role. [Aws cli with iam role](https://docs.aws.amazon.com/cli/v1/userguide/cli-configure-role.html)

Step 2: Build the docker image using the dockerfile provided.
``` 
docker build -t gdal2postgis .
```
Step 2 : Tag the docker image
The local docker shoulde be tagged to ready for ECR pushing. The tag should be the same as the ECR repository name. You can find the ECR repository name in the AWS console. The tag should be in the format of ```aws_account_id.dkr.ecr.region.amazonaws.com/{namespace}/repository_name:tag``` For example 
```123456789012.dkr.ecr.us-east-1.amazonaws.com/{namespace}/gdal2postgis:latest```
There are two points to be noted here:
1. Login the ECR and build the repository if it does not exist. You can use the following command to login the ECR: 
```aws ecr get-login-password --region region | docker login --username AWS --password-stdin aws_account_id.dkr.ecr.region.amazonaws.com```
2. Acquire the account id with command: 
```aws sts get-caller-identity --query Account --output text```

Step 3: Push the docker image to ECR
Push the docker image to ECR using the following command: 
```aws push 123456789012.dkr.ecr.us-east-1.amazonaws.com/{namespace}/gdal2postgis:latest```

Step 4: Create a lambda function using the docker image
Create a lambda function using the docker image using the following command: 
```aws lambda create-function --function-name gdal2postgis --package-type Image --code ImageUri=123456789012.dkr.ecr.us-east-1.amazonaws.com/{namespace}/gdal2postgis:latest --role arn:aws:iam::123456789012:role/lambda-ex --timeout 15 --memory-size 1024```
or set up the lambda with aws console.

## Summary

### Build the Docker image
docker build -t my-lambda-image .

### Authenticate Docker to ECR
```
aws ecr get-login-password --region <region> | docker login --username AWS --password-stdin <aws_account_id>.dkr.ecr.<region>.amazonaws.com
```
BTW: how to get account id
```
aws sts get-caller-identity --query "Account" --output text
```

### Tag the Docker image
```
docker tag my-lambda-image:latest <aws_account_id>.dkr.ecr.<region>.amazonaws.com/<repository-name>:latest
```

### Push the Docker image to ECR
```
docker push <aws_account_id>.dkr.ecr.<region>.amazonaws.com/<repository-name>:latest
```

