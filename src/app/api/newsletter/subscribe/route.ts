import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // Validate email
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Get Mailchimp credentials from environment variables
    const apiKey = process.env.MAILCHIMP_API_KEY;
    const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;
    const serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX || 'us14';

    if (!apiKey || !audienceId) {
      console.error('Mailchimp credentials not configured');
      return NextResponse.json(
        { error: 'Newsletter service not configured' },
        { status: 500 }
      );
    }

    // Create subscriber hash for Mailchimp (MD5 of lowercase email)
    const subscriberHash = crypto
      .createHash('md5')
      .update(email.toLowerCase())
      .digest('hex');

    // Mailchimp API endpoint
    const url = `https://${serverPrefix}.api.mailchimp.com/3.0/lists/${audienceId}/members/${subscriberHash}`;

    // Make request to Mailchimp
    const response = await fetch(url, {
      method: 'PUT', // PUT to add or update subscriber
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        email_address: email.toLowerCase(),
        status_if_new: 'subscribed', // Status for new subscribers
        status: 'subscribed', // Update status if already exists
        merge_fields: {
          SIGNUP_SRC: 'Website Modal',
          SIGNUP_DATE: new Date().toISOString(),
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Mailchimp error:', data);
      
      // Handle specific Mailchimp errors
      if (data.title === 'Member Exists') {
        return NextResponse.json(
          { 
            error: 'This email is already subscribed',
            code: 'ALREADY_SUBSCRIBED'
          },
          { status: 400 }
        );
      }

      if (data.title === 'Invalid Resource') {
        return NextResponse.json(
          { error: 'Invalid email address' },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: 'Failed to subscribe to newsletter' },
        { status: response.status }
      );
    }

    // Success
    return NextResponse.json(
      {
        success: true,
        message: 'Successfully subscribed to newsletter',
        email: email.toLowerCase(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
