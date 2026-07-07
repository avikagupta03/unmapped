const nodemailer = require('nodemailer');

const getTransporter = () => nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

const base = (content) => `
<html><body style="font-family:Arial,sans-serif;background:#0a0a0a;color:#f5f0ea;margin:0;padding:20px;">
<div style="max-width:600px;margin:0 auto;background:#141414;border-radius:16px;overflow:hidden;">
  <div style="padding:24px 32px;border-bottom:1px solid #2a2a2a;">
    <div style="font-size:24px;font-weight:900;color:#f5f0ea;letter-spacing:-1px;">unmapped</div>
    <div style="color:#c8b59a;font-size:11px;text-transform:uppercase;letter-spacing:3px;margin-top:4px;">Escape the ordinary</div>
  </div>
  <div style="padding:32px;">${content}</div>
  <div style="padding:20px 32px;border-top:1px solid #2a2a2a;color:#555;font-size:12px;">
    © 2026 unmapped · <a href="${process.env.CLIENT_URL||'http://localhost:3000'}" style="color:#c8b59a;">unmapped.in</a>
  </div>
</div></body></html>`;

const btn = (text, url) => `<a href="${url}" style="display:inline-block;background:#d4a96a;color:#0a0a0a;padding:14px 28px;border-radius:50px;font-weight:700;font-size:14px;text-decoration:none;margin:16px 0;">${text}</a>`;

const sendBookingConfirmation = async (inquiry, trip) => {
  if (!process.env.EMAIL_USER) return;
  try {
    await getTransporter().sendMail({
      from: process.env.EMAIL_FROM || 'unmapped <hello@unmapped.in>',
      to: inquiry.email,
      subject: `Inquiry received for ${inquiry.selectedTrip} 🏔️`,
      html: base(`
        <h2 style="color:#f5f0ea;margin:0 0 8px;">Hey ${inquiry.userName}! 👋</h2>
        <p style="color:#888;line-height:1.6;">We got your inquiry for <strong style="color:#c8b59a;">${inquiry.selectedTrip}</strong>. Our team will reach out within <strong style="color:#c8b59a;">24 hours</strong>.</p>
        ${trip ? `<div style="background:#1c1c1c;border-radius:12px;overflow:hidden;margin:24px 0;border:1px solid #2a2a2a;">
          <img src="${trip.image}" alt="${trip.title}" style="width:100%;height:180px;object-fit:cover;"/>
          <div style="padding:16px;">
            <div style="font-size:18px;font-weight:900;color:#f5f0ea;">${trip.title}</div>
            <div style="color:#c8b59a;font-size:13px;margin-top:4px;">📍 ${trip.location} · ⏱️ ${trip.duration}</div>
            <div style="font-size:24px;font-weight:900;color:#d4a96a;margin-top:8px;">₹${trip.price?.toLocaleString()}</div>
          </div>
        </div>` : ''}
        <p style="color:#888;">Can't wait? Reach us directly:</p>
        ${btn('💬 WhatsApp Us', `https://wa.me/${process.env.WA_NUMBER||'919999999999'}`)}
        <p style="color:#555;font-size:13px;margin-top:16px;">No advance payment required.</p>
      `),
    });
  } catch (err) { console.error('Confirmation email error:', err.message); }
};

const sendAdminNotification = async (inquiry) => {
  if (!process.env.EMAIL_USER || !process.env.ADMIN_EMAIL) return;
  try {
    await getTransporter().sendMail({
      from: process.env.EMAIL_FROM || 'unmapped <hello@unmapped.in>',
      to: process.env.ADMIN_EMAIL,
      subject: `New inquiry: ${inquiry.selectedTrip} from ${inquiry.userName}`,
      html: base(`
        <h2 style="color:#f5f0ea;">New booking inquiry 📩</h2>
        <div style="background:#1c1c1c;border-radius:12px;padding:20px;border:1px solid #2a2a2a;">
          <p style="margin:0 0 12px;"><span style="color:#c8b59a;font-size:11px;text-transform:uppercase;letter-spacing:1px;">Name</span><br/><strong style="color:#f5f0ea;font-size:16px;">${inquiry.userName}</strong></p>
          <p style="margin:0 0 12px;"><span style="color:#c8b59a;font-size:11px;text-transform:uppercase;letter-spacing:1px;">Trip</span><br/><span style="color:#f5f0ea;">${inquiry.selectedTrip}</span></p>
          <p style="margin:0 0 12px;"><span style="color:#c8b59a;font-size:11px;text-transform:uppercase;letter-spacing:1px;">Contact</span><br/><span style="color:#f5f0ea;">📞 ${inquiry.phone}<br/>✉️ ${inquiry.email}</span></p>
          <p style="margin:0;"><span style="color:#c8b59a;font-size:11px;text-transform:uppercase;letter-spacing:1px;">Details</span><br/><span style="color:#f5f0ea;">👥 ${inquiry.travelers} · ${inquiry.travelType} · ${inquiry.budget||'Flexible budget'}</span></p>
          ${inquiry.message?`<p style="color:#888;font-style:italic;margin-top:12px;">"${inquiry.message}"</p>`:''}
        </div>
        ${btn(`💬 WhatsApp ${inquiry.userName}`, `https://wa.me/${inquiry.phone.replace(/\D/g,'')}`)}`),
    });
  } catch (err) { console.error('Admin notification error:', err.message); }
};

const sendReminderEmail = async (inquiry, trip) => {
  if (!process.env.EMAIL_USER) return;
  try {
    await getTransporter().sendMail({
      from: process.env.EMAIL_FROM || 'unmapped <hello@unmapped.in>',
      to: inquiry.email,
      subject: `Still thinking about ${inquiry.selectedTrip}? 🏔️`,
      html: base(`
        <h2 style="color:#f5f0ea;">Hey ${inquiry.userName} 👋</h2>
        <p style="color:#888;line-height:1.6;">You were looking at <strong style="color:#c8b59a;">${inquiry.selectedTrip}</strong>. Seats are filling up — don't miss out.</p>
        ${trip ? `<div style="background:#1c1c1c;border-radius:12px;overflow:hidden;margin:24px 0;border:1px solid #2a2a2a;">
          <img src="${trip.image}" alt="${trip.title}" style="width:100%;height:160px;object-fit:cover;"/>
          <div style="padding:16px;">
            <div style="font-size:18px;font-weight:900;color:#f5f0ea;">${trip.title}</div>
            <div style="color:#c8b59a;font-size:13px;margin-top:4px;">📍 ${trip.location} · ⏱️ ${trip.duration}</div>
            <div style="font-size:22px;font-weight:900;color:#d4a96a;margin-top:8px;">₹${trip.price?.toLocaleString()}</div>
            ${trip.seatsAvailable<=5?`<div style="color:#f87171;font-size:12px;margin-top:6px;">🔥 Only ${trip.seatsAvailable} seats left!</div>`:''}
          </div>
        </div>` : ''}
        ${btn('Complete Your Booking →', `${process.env.CLIENT_URL||'http://localhost:3000'}/${trip?.type==='trek'?'trek':'trips'}/${trip?.slug||''}`)}
        <p style="color:#555;font-size:13px;margin-top:8px;">Or just reply to this email and we'll sort it out.</p>
      `),
    });
    console.log(`Reminder sent to ${inquiry.email}`);
  } catch (err) { console.error('Reminder email error:', err.message); }
};

module.exports = { sendBookingConfirmation, sendAdminNotification, sendReminderEmail };
