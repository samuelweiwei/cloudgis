# SQS Lambda Handler

A TypeScript AWS Lambda function designed to handle SQS events with proper error handling and partial batch failure support.

## Features

- **TypeScript**: Fully typed with AWS Lambda and SQS types
- **ES Modules**: Compiles to `.mjs` files for modern Lambda runtime
- **SQS Event Handler**: Specifically designed for SQS trigger events
- **Partial Batch Failure**: Supports SQS partial batch failure handling
- **Error Handling**: Comprehensive error handling and logging
- **Retry Logic**: Built-in retry utilities for resilient operations
- **Type Safety**: Custom types for message validation

## Project Structure

```
├── src/
│   ├── index.ts      # Main Lambda handler
│   ├── types.ts      # TypeScript type definitions
│   └── utils.ts      # Utility functions
├── dist/             # Compiled .mjs files (generated)
├── package.json      # Dependencies and scripts
├── tsconfig.json     # TypeScript configuration
└── README.md         # Documentation
```

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Build the project:**
   ```bash
   npm run build
   ```
   This will compile TypeScript to JavaScript and rename `.js` files to `.mjs`

3. **Clean build artifacts:**
   ```bash
   npm run clean
   ```

## Configuration

### Lambda Function Settings

- **Runtime**: Node.js 18.x or later
- **Handler**: `dist/index.handler`
- **Architecture**: x86_64 or arm64

### Environment Variables

- `AWS_REGION`: AWS region for SQS client (defaults to us-east-1)

### SQS Configuration

Enable **partial batch failure** reporting in your SQS trigger configuration:
- Set `ReportBatchItemFailures` to `true`
- Configure appropriate visibility timeout
- Set up dead letter queue for failed messages

## Message Format

The handler expects JSON messages with an `action` field:

### Order Processing Message
```json
{
  "action": "process_order",
  "orderId": "order-123",
  "customerId": "customer-456",
  "items": [
    {
      "productId": "product-789",
      "quantity": 2,
      "price": 29.99
    }
  ],
  "totalAmount": 59.98,
  "timestamp": "2023-12-01T12:00:00Z"
}
```

### Notification Message
```json
{
  "action": "send_notification",
  "type": "email",
  "recipient": "user@example.com",
  "subject": "Order Confirmation",
  "message": "Your order has been processed",
  "timestamp": "2023-12-01T12:00:00Z"
}
```

## Deployment

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Create deployment package:**
   ```bash
   npm run deploy
   ```
   This creates `lambda-function.zip` with compiled code and dependencies.

3. **Upload to AWS Lambda:**
   - Via AWS Console: Upload the zip file
   - Via AWS CLI: `aws lambda update-function-code --function-name YOUR_FUNCTION_NAME --zip-file fileb://lambda-function.zip`
   - Via Infrastructure as Code: Use the zip file in your CloudFormation/CDK/Terraform templates

## Development

### Adding New Message Types

1. Define the message type in `src/types.ts`
2. Add validation logic in `src/utils.ts`
3. Implement processing logic in `src/index.ts`

### Error Handling

The handler implements several levels of error handling:

- **Message-level**: Individual message processing errors
- **Batch-level**: Partial batch failure reporting
- **Retry logic**: Configurable retry mechanism for transient failures

### Logging

Structured JSON logging is implemented throughout:
- All logs include timestamps and log levels
- Message processing includes correlation IDs
- Error logs include full error details

## Monitoring

Monitor your Lambda function using:

- **CloudWatch Logs**: All console output
- **CloudWatch Metrics**: Lambda execution metrics
- **X-Ray Tracing**: Distributed tracing (if enabled)
- **SQS Metrics**: Queue depth, message age, etc.

## Troubleshooting

### Common Issues

1. **Import Errors**: Ensure all imports use `.js` extension for compiled modules
2. **SQS Permissions**: Lambda execution role needs SQS permissions
3. **Timeout**: Adjust Lambda timeout based on processing requirements
4. **Memory**: Monitor memory usage and adjust allocation

### Testing

Test your function with sample SQS events:

```bash
# Create a test event file
echo '{
  "Records": [
    {
      "messageId": "test-123",
      "body": "{\"action\":\"process_order\",\"orderId\":\"test-order\"}",
      "attributes": {},
      "eventSource": "aws:sqs"
    }
  ]
}' > test-event.json

# Test locally with AWS SAM CLI
sam local invoke -e test-event.json
```