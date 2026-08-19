import { createTransport } from 'nodemailer';
export async function POST(request) {
  const body = await request.json();
  try {
    const response = await sendMail(body)
    return new Response(JSON.stringify({ success: true, messageId: response }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (e) {
    console.log(e);
    return new Response(JSON.stringify({ success: false, error: 'Failed to send email' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

async function sendMail(body) {
  const transporter = createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER || "",
      pass: process.env.MAIL_PASS || ""
    }
  });
  try {
    const name = body.name || 'User';
    const info = await transporter.sendMail({
      from: body.from,
      to: body.to,
      subject: body.subject,
      // html: `
      //     <h1>Welcome to Coworks, ${name}!</h1>
      //     <p>Thank you for joining our platform. We're excited to have you as part of our coworking community.</p>
      //     <p>With Coworks, you can:</p>
      //     <ul>
      //       <li>Book workspaces and meeting rooms</li>
      //       <li>Manage your bookings</li>
      //       <li>Access special offers and events</li>
      //     </ul>
      //     <p>If you have any questions, feel free to contact our support team.</p>
      //     <p>Happy coworking!</p>
      //     <p>Regards,<br>The Coworks Team</p>
      //   `
      html: body.html,
    });

    console.log('Email sent: ', info.messageId);
    return info.messageId;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}