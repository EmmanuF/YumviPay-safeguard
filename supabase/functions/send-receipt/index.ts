
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const sendgridApiKey = Deno.env.get('SENDGRID_API_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ReceiptEmailRequest {
  recipientEmail: string;
  recipientName: string;
  transactionId: string;
  amount: number;
  fee: number;
  totalAmount: number;
  currency: string;
  date: string;
  status: string;
  paymentMethod: string;
  country: string;
  provider?: string;
  htmlContent?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { 
      recipientEmail, 
      recipientName, 
      transactionId, 
      amount, 
      fee, 
      totalAmount,
      currency,
      date,
      status,
      paymentMethod,
      country,
      provider,
      htmlContent
    } = await req.json() as ReceiptEmailRequest

    if (!recipientEmail) {
      return new Response(
        JSON.stringify({ error: 'Recipient email is required' }),
        { 
          status: 400, 
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders 
          } 
        }
      )
    }

    let emailHtml = htmlContent

    if (!emailHtml) {
      // Generate basic HTML if htmlContent wasn't provided
      emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Transaction Receipt - ${transactionId}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
            }
            .receipt {
              border: 1px solid #ddd;
              border-radius: 8px;
              padding: 20px;
              margin-bottom: 20px;
            }
            .receipt-header {
              text-align: center;
              border-bottom: 2px solid #f0f0f0;
              padding-bottom: 15px;
              margin-bottom: 20px;
            }
            .receipt-header h1 {
              color: #6366f1;
              margin: 0;
              font-size: 24px;
            }
            .receipt-header p {
              color: #666;
              margin: 5px 0 0;
            }
            .info-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 10px;
              border-bottom: 1px solid #f0f0f0;
              padding-bottom: 10px;
            }
            .info-row:last-child {
              border-bottom: none;
            }
            .label {
              font-weight: bold;
              color: #555;
            }
            .value {
              text-align: right;
            }
            .total-row {
              display: flex;
              justify-content: space-between;
              font-weight: bold;
              margin-top: 20px;
              font-size: 18px;
              border-top: 2px solid #f0f0f0;
              padding-top: 15px;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              font-size: 12px;
              color: #999;
            }
            .status {
              display: inline-block;
              padding: 5px 10px;
              border-radius: 4px;
              font-weight: bold;
              text-transform: uppercase;
              font-size: 12px;
            }
            .status-completed {
              background-color: #ecfdf5;
              color: #059669;
            }
            .status-pending {
              background-color: #fffbeb;
              color: #d97706;
            }
            .status-failed {
              background-color: #fef2f2;
              color: #dc2626;
            }
          </style>
        </head>
        <body>
          <div class="receipt">
            <div class="receipt-header">
              <h1>Yumvi Pay</h1>
              <p>Transaction Receipt</p>
              <p>${date}</p>
              <p>
                <span class="status status-${status === 'completed' ? 'completed' : (status === 'pending' || status === 'processing') ? 'pending' : 'failed'}">
                  ${status}
                </span>
              </p>
            </div>
            
            <div class="info-row">
              <span class="label">Transaction ID:</span>
              <span class="value">${transactionId}</span>
            </div>
            
            <div class="info-row">
              <span class="label">Recipient:</span>
              <span class="value">${recipientName}</span>
            </div>
            
            <div class="info-row">
              <span class="label">Country:</span>
              <span class="value">${country}</span>
            </div>
            
            <div class="info-row">
              <span class="label">Payment Method:</span>
              <span class="value">${paymentMethod || 'N/A'}</span>
            </div>
            
            ${provider ? `
            <div class="info-row">
              <span class="label">Provider:</span>
              <span class="value">${provider}</span>
            </div>
            ` : ''}
            
            <div class="info-row">
              <span class="label">Amount:</span>
              <span class="value">${amount.toFixed(2)} ${currency}</span>
            </div>
            
            <div class="info-row">
              <span class="label">Fee:</span>
              <span class="value">${fee > 0 ? `${fee.toFixed(2)} ${currency}` : 'Free'}</span>
            </div>
            
            <div class="total-row">
              <span>Total:</span>
              <span>${totalAmount.toFixed(2)} ${currency}</span>
            </div>
          </div>
          
          <div class="footer">
            <p>This receipt was generated electronically by Yumvi Pay.</p>
            <p>For any questions, please contact support@yumvipay.com</p>
          </div>
        </body>
        </html>
      `;
    }

    // Prepare SendGrid API request
    console.log(`Sending receipt email to ${recipientEmail}`);
    
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${sendgridApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: recipientEmail }],
            subject: `Receipt for Transaction ${transactionId}`
          }
        ],
        from: { email: 'receipt@yumvipay.com', name: 'Yumvi Pay' },
        content: [
          {
            type: 'text/html',
            value: emailHtml
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('SendGrid API error:', errorData);
      throw new Error(`SendGrid API error: ${response.status} ${response.statusText}`);
    }

    console.log('Email sent successfully via SendGrid');
    
    return new Response(
      JSON.stringify({ success: true }),
      { 
        status: 200, 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        } 
      }
    );
  } catch (error) {
    console.error('Error sending receipt email:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      }),
      { 
        status: 500, 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        } 
      }
    );
  }
});
