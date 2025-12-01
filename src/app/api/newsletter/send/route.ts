import { NextResponse } from 'next/server';
import { verifyToken, getTokenFromHeaders } from '@/lib/auth';
import { saveNewsletter, generateNewsletterHTML, Newsletter } from '@/lib/newsletter';

export async function POST(request: Request) {
  try {
    const token = getTokenFromHeaders(request.headers);
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { newsletter } = await request.json();

    if (!newsletter) {
      return NextResponse.json(
        { error: 'Newsletter data is required' },
        { status: 400 }
      );
    }

    // Check for Mailchimp credentials
    const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY;
    const MAILCHIMP_LIST_ID = process.env.MAILCHIMP_LIST_ID || process.env.MAILCHIMP_AUDIENCE_ID;
    const MAILCHIMP_SERVER_PREFIX = process.env.MAILCHIMP_SERVER_PREFIX; // e.g., "us1"

    if (!MAILCHIMP_API_KEY || !MAILCHIMP_LIST_ID || !MAILCHIMP_SERVER_PREFIX) {
      return NextResponse.json(
        { error: 'Mailchimp credentials not configured. Please set MAILCHIMP_API_KEY, MAILCHIMP_AUDIENCE_ID, and MAILCHIMP_SERVER_PREFIX in .env.local' },
        { status: 500 }
      );
    }

    // Generate HTML content
    const htmlContent = generateNewsletterHTML(newsletter);

    // Create Mailchimp campaign
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
            subject_line: newsletter.subject,
            from_name: 'AI Blog - by Michele Laurelli',
            reply_to: process.env.MAILCHIMP_FROM_EMAIL || 'm.laurelli@algoretico.it',
            title: `Newsletter - ${new Date().toISOString().split('T')[0]}`,
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

    // Send campaign
    const sendResponse = await fetch(
      `https://${MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0/campaigns/${campaignId}/actions/send`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${MAILCHIMP_API_KEY}`,
        },
      }
    );

    if (!sendResponse.ok) {
      const error = await sendResponse.json();
      console.error('Mailchimp send error:', error);
      return NextResponse.json(
        { error: 'Failed to send campaign', details: error },
        { status: 500 }
      );
    }

    // Get campaign stats (after a brief delay)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const statsResponse = await fetch(
      `https://${MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0/campaigns/${campaignId}`,
      {
        headers: {
          'Authorization': `Bearer ${MAILCHIMP_API_KEY}`,
        },
      }
    );

    let recipientCount = 0;
    if (statsResponse.ok) {
      const stats = await statsResponse.json();
      recipientCount = stats.emails_sent || stats.recipients?.recipient_count || 0;
    }

    // Save newsletter to data file
    const newsletterToSave: Newsletter = {
      ...newsletter,
      status: 'sent',
      sentDate: new Date().toISOString(),
      mailchimp_campaign_id: campaignId,
      recipient_count: recipientCount,
    };

    saveNewsletter(newsletterToSave);

    return NextResponse.json({
      success: true,
      message: 'Newsletter sent successfully',
      campaignId,
      recipientCount,
    });

  } catch (error: any) {
    console.error('Error sending newsletter:', error);
    return NextResponse.json(
      { error: 'Failed to send newsletter', details: error.message },
      { status: 500 }
    );
  }
}
