import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM_EMAIL = 'BSR Shopping Mall <orders@bsrshoppingmall.com>'; // Update with verified domain
const ADMIN_EMAIL = 'info@bsrshoppingmall.com';

interface OrderConfirmationProps {
  orderId: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  items: Array<{ name: string; quantity: number; price: number }>;
}

export async function sendOrderConfirmation({
  orderId,
  customerName,
  customerEmail,
  amount,
  items
}: OrderConfirmationProps) {
  if (!resend) {
    console.warn("RESEND_API_KEY is not configured. Skipping email send.");
    return { success: false, error: "RESEND_API_KEY not configured" };
  }

  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #374151;">${item.name}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center; color: #374151;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; color: #374151;">₹${item.price}</td>
    </tr>
  `).join('');

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 20px; background-color: #ffffff;">
      <div style="text-align: center; margin-bottom: 32px;">
        <h1 style="color: #E53935; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: -0.5px;">BSR Shopping Mall</h1>
      </div>
      
      <div style="background-color: #f9fafb; border-radius: 12px; padding: 24px; margin-bottom: 32px;">
        <h2 style="color: #111827; margin-top: 0; margin-bottom: 16px; font-size: 20px;">Thank you for your order!</h2>
        <p style="color: #4b5563; line-height: 1.6; margin: 0 0 16px;">Hi ${customerName},</p>
        <p style="color: #4b5563; line-height: 1.6; margin: 0;">Your order <strong style="color: #111827;">#${orderId.slice(0, 8).toUpperCase()}</strong> has been successfully placed and is being processed by our team.</p>
      </div>
      
      <h3 style="color: #111827; font-size: 16px; margin-bottom: 16px; border-bottom: 2px solid #E53935; padding-bottom: 8px; display: inline-block;">Order Summary</h3>
      
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 32px; font-size: 14px;">
        <thead>
          <tr style="background-color: #f9fafb;">
            <th style="padding: 12px; text-align: left; color: #6b7280; font-weight: 500; border-bottom: 1px solid #e5e7eb; border-radius: 6px 0 0 0;">Item</th>
            <th style="padding: 12px; text-align: center; color: #6b7280; font-weight: 500; border-bottom: 1px solid #e5e7eb;">Qty</th>
            <th style="padding: 12px; text-align: right; color: #6b7280; font-weight: 500; border-bottom: 1px solid #e5e7eb; border-radius: 0 6px 0 0;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2" style="padding: 16px 12px; text-align: right; font-weight: 600; color: #111827;">Total:</td>
            <td style="padding: 16px 12px; text-align: right; font-weight: 700; color: #E53935; font-size: 16px;">₹${amount}</td>
          </tr>
        </tfoot>
      </table>
      
      <div style="border-top: 1px solid #e5e7eb; padding-top: 32px; color: #6b7280; font-size: 14px; line-height: 1.6; text-align: center;">
        <p style="margin: 0 0 8px;">We'll notify you once your order is shipped.</p>
        <p style="margin: 0;">Best regards,<br><strong style="color: #111827;">BSR Shopping Mall Team</strong></p>
      </div>
    </div>
  `;

  try {
    // Note: Resend requires a verified domain to send emails. 
    // If testing on a free account, you can only send to the email you signed up with.
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [customerEmail],
      bcc: [ADMIN_EMAIL],
      subject: `Order Confirmation - BSR Shopping Mall #${orderId.slice(0, 8).toUpperCase()}`,
      html: html,
    });

    if (error) {
      console.error("Resend API error:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error("Failed to send email exception:", err);
    return { success: false, error: err };
  }
}
