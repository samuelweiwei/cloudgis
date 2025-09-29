import { SQSEvent, SQSHandler, Context } from 'aws-lambda';
import { SQSClient, DeleteMessageCommand } from '@aws-sdk/client-sqs';

// Initialize SQS client
const sqsClient = new SQSClient({ region: process.env.AWS_REGION || 'us-east-1' });

interface ProcessedMessage {
  messageId: string;
  body: any;
  status: 'success' | 'error';
  error?: string;
}

// Business logic for processing individual SQS messages
async function processMessage(messageBody: string, messageId: string): Promise<ProcessedMessage> {
  try {
    console.log(`Processing message ${messageId}:`, messageBody);
    
    // Parse the message body (assuming JSON)
    const parsedBody = JSON.parse(messageBody);
    
    // Add your business logic here
    // Example: validate data, call external APIs, save to database, etc.
    
    // Simulate some processing time
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Example processing logic
    if (parsedBody.action === 'process_order') {
      console.log(`Processing order: ${parsedBody.orderId}`);
      // Add order processing logic here
    } else if (parsedBody.action === 'send_notification') {
      console.log(`Sending notification to: ${parsedBody.recipient}`);
      // Add notification logic here
    } else {
      console.log(`Unknown action: ${parsedBody.action}`);
    }
    
    return {
      messageId,
      body: parsedBody,
      status: 'success'
    };
    
  } catch (error) {
    console.error(`Error processing message ${messageId}:`, error);
    return {
      messageId,
      body: messageBody,
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Main Lambda handler for SQS events
export const handler = async (event: any) => {
  console.log('SQS Event received:', JSON.stringify(event, null, 2));
  // console.log('Lambda Context:', JSON.stringify(context, null, 2));
  
  const results: ProcessedMessage[] = [];
  const batchItemFailures: { itemIdentifier: string }[] = [];
  
  // Process each record in the SQS event
  for (const record of event.Records) {
    try {
      const result = await processMessage(record.body, record.messageId);
      results.push(result);
      
      // If processing failed, add to batch failures for partial batch failure handling
      if (result.status === 'error') {
        batchItemFailures.push({
          itemIdentifier: record.messageId
        });
      }
      
      console.log(`Message ${record.messageId} processed with status: ${result.status}`);
      
    } catch (error) {
      console.error(`Failed to process record ${record.messageId}:`, error);
      batchItemFailures.push({
        itemIdentifier: record.messageId
      });
    }
  }
  
  // Log processing summary
  const successCount = results.filter(r => r.status === 'success').length;
  const errorCount = results.filter(r => r.status === 'error').length;
  
  console.log(`Processing complete. Success: ${successCount}, Errors: ${errorCount}`);
  
  // Always return batchItemFailures as an array (empty if no failures)
  // This matches the SQSBatchResponse type
  console.log('Batch item failures:', batchItemFailures);
  return {
    batchItemFailures
  };
};