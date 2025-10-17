// api/send-email.js
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // Add comprehensive logging at the start
  console.log('=== API Handler Started ===');
  console.log('Request Method:', req.method);
  console.log('Request Body:', JSON.stringify(req.body, null, 2));
  console.log('RESEND_API_KEY exists:', !!process.env.RESEND_API_KEY);
  console.log('RESEND_API_KEY length:', process.env.RESEND_API_KEY ? process.env.RESEND_API_KEY.length : 0);
  console.log('Environment:', process.env.NODE_ENV || 'development');
  
  // CORS headers for local testing
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Max-Age', '86400');

  if (req.method === 'OPTIONS') {
    console.log('OPTIONS request handled');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    console.log('Method not allowed:', req.method);
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed. Only POST requests are accepted.' 
    });
  }

  try {
    // Validate required fields
    const { name, email, message } = req.body;
    
    console.log('Validating fields:');
    console.log('- Name:', name ? 'Present' : 'Missing');
    console.log('- Email:', email ? 'Present' : 'Missing');
    console.log('- Message:', message ? 'Present' : 'Missing');

    if (!name || !email || !message) {
      const missingFields = [];
      if (!name) missingFields.push('name');
      if (!email) missingFields.push('email');
      if (!message) missingFields.push('message');
      
      console.log('Validation failed - missing fields:', missingFields);
      return res.status(400).json({
        success: false,
        error: `Missing required fields: ${missingFields.join(', ')}`,
        details: { missingFields }
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Validation failed - invalid email format:', email);
      return res.status(400).json({
        success: false,
        error: 'Invalid email format',
        details: { field: 'email', value: email }
      });
    }

    // Check if RESEND_API_KEY is available
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured');
      return res.status(500).json({
        success: false,
        error: 'Email service not configured. Please contact the administrator.',
        details: { issue: 'missing_api_key' }
      });
    }

    console.log('Attempting to send email with Resend...');
    
    // Test with hardcoded values first to verify API key works
    const testEmail = {
      from: 'Portfolio Contact Form <onboarding@resend.dev>',
      to: ['sadhukhankalyan21@gmail.com'],
      subject: `New Contact Form Message from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">New Contact Form Message</h2>
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <p style="margin: 5px 0;"><strong>Name:</strong> ${name}</p>
            <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 5px 0;"><strong>Subject:</strong> Portfolio Contact Form</p>
          </div>
          <div style="margin: 15px 0;">
            <p style="margin: 5px 0;"><strong>Message:</strong></p>
            <div style="background-color: white; padding: 15px; border-left: 4px solid #007bff; white-space: pre-wrap; font-family: monospace;">${message}</div>
          </div>
          <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #666;">
            <p>This message was sent from your portfolio contact form.</p>
            <p>Reply directly to this email to respond to ${name}.</p>
          </div>
        </div>
      `,
      replyTo: email,
    };

    console.log('Email payload prepared:', {
      from: testEmail.from,
      to: testEmail.to,
      subject: testEmail.subject,
      replyTo: testEmail.replyTo,
      htmlLength: testEmail.html.length
    });

    const result = await resend.emails.send(testEmail);

    console.log('Email sent successfully:', result);
    console.log('=== API Handler Completed Successfully ===');
    
    return res.status(200).json({ 
      success: true, 
      message: 'Email sent successfully',
      data: {
        id: result.data?.id,
        to: testEmail.to,
        subject: testEmail.subject
      }
    });

  } catch (error) {
    console.error('=== API Error Details ===');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    // Log specific Resend API errors
    if (error.response) {
      console.error('Resend API response error:', error.response.data);
      console.error('Resend API status:', error.response.status);
    }
    
    console.error('=== End API Error Details ===');
    
    // Return detailed error information
    const errorMessage = error.message || 'Unknown error occurred';
    const errorDetails = {
      type: error.constructor.name,
      message: errorMessage,
      timestamp: new Date().toISOString()
    };

    // Add Resend-specific error details if available
    if (error.response?.data) {
      errorDetails.resend = error.response.data;
    }

    return res.status(500).json({ 
      success: false, 
      error: 'Failed to send email. Please try again later.',
      details: errorDetails
    });
  }
}