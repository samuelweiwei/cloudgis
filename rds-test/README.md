# Lambda to RDS latest update
Updating an AWS Lambda function to connect to the latest version of Amazon RDS involves several steps. Below is a general guide to help you through the process:

### Step 1: Update the RDS Endpoint

1. **Check the RDS Endpoint:**    
Ensure you have the latest endpoint for your RDS instance. You can find this in the RDS console under the "Connectivity & security" tab.

2. **Update the Lambda Environment Variable:**

If you are using environment variables to store the RDS endpoint, update the environment variable in the Lambda console or using the AWS CLI. Here we apply hard coding in the test.

### Step 2: Include lambda VPC Configuration into RDS Security Group

1. **VPC Configuration:** Ensure that your Lambda function is configured to connect to the VPC where your RDS instance resides. This involves setting up the VPC ID, Subnet IDs, and Security Group IDs in the Lambda configuration.

2. **Security Group:** Make sure the security group associated with your RDS instance allows inbound traffic from the security group associated with your Lambda function. This typically involves adding a rule to the RDS security group to allow traffic on the port your RDS instance is listening on (e.g., 3306 for MySQL, 5432 for PostgreSQL).

3. **Subnet Group:** Ensure that the subnet group associated with your RDS instance includes the subnets where your Lambda function is deployed.

4. **inbound rule & outbound rule:** Ensure that the security group associated with your Lambda function allows outbound traffic to the RDS instance. This typically involves adding a rule to the Lambda security group to allow outbound traffic on the port your RDS instance is listening on. Also, ensure that the security group associated with your RDS instance allows inbound traffic from the Lambda security group.

### step 3: Test the Lambda Function
Test the lambda function to ensure that it can connect to the RDS instance. You can use the AWS Lambda console to test the function with a test event. The test event should include the necessary parameters for the function to connect to the RDS instance.
caveats:
The configuration code should only be applied as development. There must be a proper SSL certificates in production.
```
ssl: {
        rejectUnauthorized: false // For development only. In production, use proper SSL certificates
    },
```