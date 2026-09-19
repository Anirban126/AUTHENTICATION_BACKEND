export function generateOtp(){
    return Math.floor(100000 + Math.random()*900000).toString();
}

export function getOtpHtml(otp) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Your OTP Code</title>
</head>

<body style="
    margin: 0;
    padding: 0;
    background-color: #f4f7fb;
    font-family: Arial, Helvetica, sans-serif;
">

    <table width="100%" cellpadding="0" cellspacing="0" border="0"
        style="background-color: #f4f7fb; padding: 40px 15px;">

        <tr>
            <td align="center">

                <!-- Main Card -->
                <table width="100%" cellpadding="0" cellspacing="0" border="0"
                    style="
                        max-width: 500px;
                        background-color: #ffffff;
                        border-radius: 16px;
                        overflow: hidden;
                        box-shadow: 0 8px 30px rgba(0,0,0,0.08);
                    ">

                    <!-- Header -->
                    <tr>
                        <td align="center"
                            style="
                                background-color: #111827;
                                padding: 28px 20px;
                            ">

                            <div style="
                                font-size: 28px;
                                font-weight: bold;
                                color: #ffffff;
                            ">
                                🔐 Verify Your Account
                            </div>

                            <div style="
                                margin-top: 8px;
                                font-size: 14px;
                                color: #cbd5e1;
                            ">
                                Your one-time verification code
                            </div>

                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style="padding: 35px 30px;">

                            <p style="
                                margin: 0 0 15px;
                                font-size: 16px;
                                color: #374151;
                                line-height: 1.6;
                            ">
                                Hello,
                            </p>

                            <p style="
                                margin: 0 0 25px;
                                font-size: 15px;
                                color: #6b7280;
                                line-height: 1.6;
                            ">
                                Use the following OTP to verify your account.
                                This code is valid for a limited time.
                            </p>

                            <!-- OTP Box -->
                            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td align="center"
                                        style="
                                            background-color: #f3f4f6;
                                            border: 2px dashed #d1d5db;
                                            border-radius: 12px;
                                            padding: 22px;
                                        ">

                                        <div style="
                                            font-size: 36px;
                                            font-weight: bold;
                                            letter-spacing: 8px;
                                            color: #111827;
                                        ">
                                            ${otp}
                                        </div>

                                    </td>
                                </tr>
                            </table>

                            <p style="
                                margin: 25px 0 0;
                                text-align: center;
                                font-size: 13px;
                                color: #9ca3af;
                            ">
                                ⏱ This OTP will expire in <strong>10 minutes</strong>.
                            </p>

                            <hr style="
                                border: 0;
                                border-top: 1px solid #e5e7eb;
                                margin: 30px 0;
                            " />

                            <p style="
                                margin: 0;
                                font-size: 13px;
                                color: #9ca3af;
                                line-height: 1.6;
                            ">
                                If you did not request this verification code,
                                you can safely ignore this email. Never share your
                                OTP with anyone.
                            </p>

                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td align="center"
                            style="
                                background-color: #f9fafb;
                                padding: 20px;
                                border-top: 1px solid #e5e7eb;
                            ">

                            <p style="
                                margin: 0;
                                font-size: 12px;
                                color: #9ca3af;
                            ">
                                © 2026 Your App. All rights reserved.
                            </p>

                        </td>
                    </tr>

                </table>

            </td>
        </tr>

    </table>

</body>
</html>
`;
}

