export const template = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Email Verification</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f3f4f6;
        margin: 0;
        padding: 0;
      }

      .container {
        max-width: 600px;
        margin: 2rem auto;
        background-color: #ffffff;
        padding: 2rem;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
      }

      h1 {
        color: #111827;
      }

      p {
        color: #374151;
        line-height: 1.6;
      }

      .code {
        font-size: 1.5rem;
        font-weight: bold;
        letter-spacing: 4px;
        color: #1d4ed8;
        background-color: #e0e7ff;
        padding: 1rem;
        text-align: center;
        border-radius: 6px;
        margin: 1.5rem 0;
      }

      .footer {
        font-size: 0.85rem;
        color: #6b7280;
        margin-top: 2rem;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Hello, {{firstName}} 👋</h1>
      <p>
        Thank you for signing up! To complete your registration, please use the code below to verify your email address:
      </p>

      <div class="code">{{token}}</div>

      <p>If you didn’t request this email, please ignore it.</p>

      <div class="footer">
        © 2025 YourApp. All rights reserved.
      </div>
    </div>
  </body>
</html>
`
