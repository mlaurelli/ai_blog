import { NextResponse } from 'next/server';
import { verifyToken, getTokenFromHeaders } from '@/lib/auth';
import { generateNewsletterHTML, Newsletter } from '@/lib/newsletter';

export async function POST(request: Request) {
  try {
    const token = getTokenFromHeaders(request.headers);
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { newsletter, testEmail } = await request.json();
    
    console.log('Test email request:', { testEmail, hasNewsletter: !!newsletter });

    if (!newsletter || !testEmail) {
      return NextResponse.json(
        { error: 'Newsletter data and test email are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(testEmail)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check for Mailchimp credentials
    const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY;
    const MAILCHIMP_LIST_ID = process.env.MAILCHIMP_LIST_ID || process.env.MAILCHIMP_AUDIENCE_ID;
    const MAILCHIMP_SERVER_PREFIX = process.env.MAILCHIMP_SERVER_PREFIX;

    if (!MAILCHIMP_API_KEY || !MAILCHIMP_LIST_ID || !MAILCHIMP_SERVER_PREFIX) {
      return NextResponse.json(
        { error: 'Mailchimp credentials not configured' },
        { status: 500 }
      );
    }

    // Generate HTML content
    console.log('Generating HTML content...');
    const htmlContent = generateNewsletterHTML(newsletter);
    console.log('HTML content generated, length:', htmlContent.length);

    // Create Mailchimp campaign
    console.log('Creating Mailchimp campaign...');
    const createCampaignResponse = await fetch(
      `https://${MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0/campaigns`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${MAILCHIMP_API_KEY}`,
        },
        body: JSON.stringify({
          type: 'regular',
          recipients: {
            list_id: MAILCHIMP_LIST_ID,
          },
          settings: {
            subject_line: `[TEST] ${newsletter.subject}`,
            from_name: 'AI Blog - by Michele Laurelli',
            reply_to: process.env.MAILCHIMP_FROM_EMAIL || 'm.laurelli@algoretico.it',
            title: `TEST - Newsletter - ${new Date().toISOString().split('T')[0]}`,
          },
        }),
      }
    );

    if (!createCampaignResponse.ok) {
      const error = await createCampaignResponse.json();
      console.error('Mailchimp campaign creation error:', error);
      return NextResponse.json(
        { error: 'Failed to create Mailchimp campaign', details: error },
        { status: 500 }
      );
    }
    
    console.log('Campaign created successfully');

    const campaign = await createCampaignResponse.json();
    const campaignId = campaign.id;

    // Set campaign content
    const setContentResponse = await fetch(
      `https://${MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0/campaigns/${campaignId}/content`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${MAILCHIMP_API_KEY}`,
        },
        body: JSON.stringify({
          html: htmlContent,
        }),
      }
    );

    if (!setContentResponse.ok) {
      const error = await setContentResponse.json();
      console.error('Mailchimp set content error:', error);
      return NextResponse.json(
        { error: 'Failed to set campaign content', details: error },
        { status: 500 }
      );
    }

    // Send test email
    const sendTestResponse = await fetch(
      `https://${MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0/campaigns/${campaignId}/actions/test`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${MAILCHIMP_API_KEY}`,
        },
        body: JSON.stringify({
          test_emails: [testEmail],
          send_type: 'html',
        }),
      }
    );

    if (!sendTestResponse.ok) {
      const error = await sendTestResponse.json();
      console.error('Mailchimp send test error:', error);
      
      // Delete the campaign since test failed
      await fetch(
        `https://${MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0/campaigns/${campaignId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${MAILCHIMP_API_KEY}`,
          },
        }
      );
      
      return NextResponse.json(
        { error: 'Failed to send test email', details: error },
        { status: 500 }
      );
    }

    // Delete the test campaign after sending
    await fetch(
      `https://${MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0/campaigns/${campaignId}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${MAILCHIMP_API_KEY}`,
        },
      }
    );

    return NextResponse.json({
      success: true,
      message: `Test email sent to ${testEmail}`,
    });

  } catch (error: any) {
    console.error('Error sending test email:', error);
    return NextResponse.json(
      { error: 'Failed to send test email', details: error.message },
      { status: 500 }
    );
  }
}
