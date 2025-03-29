import * as cdk from 'aws-cdk-lib';
import * as secretmanager from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';

export interface TransformLambdaStackProps extends cdk.StackProps {
    secretName: string;
}

export class TransformLambdaStack extends cdk.Stack {
    public readonly lambdaFunction: cdk.aws_lambda.IFunction;
    constructor(scope: Construct, id: string, props?: TransformLambdaStackProps){
        super(scope, id, props);
    
        //Create lambda function
        if (!props?.secretName) {
            throw new Error('secretName is required');
        }
        this.lambdaFunction = new cdk.aws_lambda.Function(this, 'TransformGdalLambda',{
            runtime: cdk.aws_lambda.Runtime.NODEJS_22_X,
            handler: 'index.handler',
            code: cdk.aws_lambda.Code.fromAsset('./lambda/transformer'),
            environment:{
                DATABASE_SECRET: props.secretName,
            }
        })

        const dbSecret = secretmanager.Secret.fromSecretNameV2(
            this,
            'DatabaseSecret',
            props.secretName,
        )

        //Grant lambda to read the secret
        dbSecret.grantRead(this.lambdaFunction)
    }
}