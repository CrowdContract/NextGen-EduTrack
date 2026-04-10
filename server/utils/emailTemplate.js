export function generateForgotPasswordEmailTemplate(resetPasswordUrl) {

  const year = new Date().getFullYear();

  return `
  <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; padding:20px; border:1px solid #eaeaea; border-radius:10px;">
    
    <!-- Header -->
    <div style="text-align:center; margin-bottom:20px;">
      <h2 style="color:#3b82f6; margin:0;">Reset Your Password</h2>
      <p style="font-size:14px; color:#6b7280; margin:5px 0 0;">
        Secure access to your account
      </p>
    </div>

    <!-- Body -->
    <p style="font-size:16px; color:#374151;">Dear User,</p>

    <p style="font-size:16px; color:#374151;">
      We received a request to reset your password. Click the button below to create a new one.
    </p>

    <!-- Button -->
    <div style="text-align:center; margin:30px 0;">
      <a href="${resetPasswordUrl}" 
         style="
            background-color:#3b82f6;
            color:white;
            padding:12px 20px;
            text-decoration:none;
            border-radius:6px;
            font-size:16px;
            display:inline-block;
         ">
        Reset Password
      </a>
    </div>

    <!-- Backup Link -->
    <p style="font-size:14px; color:#6b7280;">
      If the button doesn't work, copy and paste this link into your browser:
    </p>

    <p style="word-break:break-all; font-size:14px; color:#2563eb;">
      ${resetPasswordUrl}
    </p>

    <!-- Footer -->
    <p style="font-size:14px; color:#6b7280;">
      This link will expire in <strong>15 minutes</strong>.
    </p>

    <p style="font-size:14px; color:#6b7280;">
      If you did not request this password reset, you can safely ignore this email.
    </p>

    <hr style="border:none; border-top:1px solid #eaeaea; margin:20px 0;" />

    <p style="font-size:12px; color:#9ca3af; text-align:center;">
      © ${year} NextGen EduTrack. All rights reserved.
    </p>

  </div>
  `;
}

// 🔹 Request Accepted Email
export function generateRequestAcceptedTemplate(supervisorName) {
  return `
    <div style="font-family: Arial; padding:20px; background:#fff; border:1px solid #ddd; border-radius:8px;">
      <h2 style="color:#10b981;">✅ Supervisor Request Accepted</h2>
      <p>Your supervisor request has been accepted by <strong>${supervisorName}</strong>.</p>
      <p>You can now start working on your project and upload files.</p>
    </div>
  `;
}

// 🔹 Request Rejected Email
export function generateRequestRejectedTemplate(supervisorName) {
  return `
    <div style="font-family: Arial; padding:20px; background:#fff; border:1px solid #ddd; border-radius:8px;">
      <h2 style="color:#ef4444;">❌ Supervisor Request Rejected</h2>
      <p>Your supervisor request has been rejected by <strong>${supervisorName}</strong>.</p>
      <p>You can try requesting another supervisor.</p>
    </div>
  `;
}