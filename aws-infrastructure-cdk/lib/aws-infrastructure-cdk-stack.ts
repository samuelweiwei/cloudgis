import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { TransformLambdaStack} from './stacks/transform-lambda-cdk-stack';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class AwsInfrastructureCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const lambdaStack = new TransformLambdaStack(this, 'TransformLambdaStack', {
      secretName: 'dev/MapviewDataProcessingStack-Dev/db-shared-host-1/staging-user',
      ...props,
    })
    // example resource
    // const queue = new sqs.Queue(this, 'AwsInfrastructureCdkQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
