import AWS from 'aws-sdk';

AWS.config.update({
  accessKeyId: "<your-accessKeyId>",
  secretAccessKey: "<your-secretAccessKey",
  region: "<your-region>",
});

const ses = new AWS.SES();

export const sendEmail = async (to: string, subject: string, body: string) => {
    let emailContent = "";

    switch (subject) {
      case "Welcome!":
        emailContent = `
            <html>
              <head></head>
              <body>
                  <img src="https://freshforever-image.s3.amazonaws.com/freshforever_logo.png" alt="FreshForever Logo" style="display: block; margin: 0 auto;">
                  <p>Hi ${body},</p>
                  <p>Welcome to FreshForever! We're excited to have you on board. Our innovative food management system helps you track your fridge inventory and alerts you when food is about to spoil.</p>
                  <a href="https://youtu.be/doQwC2c_Di4" >Checkout our demo here</a>
                  <p>If you have any questions or need assistance, our dedicated support team is here to help. Thank you for choosing FreshForever as your preferred solution for freshness and efficiency.</p>
                  <p>Best regards,</p>
                  <p>FreshForever</p>
              </body>
            </html>
        `;
        break;
      default:
        throw new Error(`Invalid email type: ${body}`);
    }

    const params = {
      Destination: {
        ToAddresses: [to],
      },
      Message: {
        Body: {
          Html: {
            Data: emailContent,
          },
        },
        Subject: {
          Data: subject,
        },
      },
      Source: "freshforever42@gmail.com",
    };
  
    try {
        const result: AWS.SES.Types.SendEmailResponse = await ses.sendEmail(params).promise();
        console.log(`Email sent successfully to ${to}`);
        console.log(result); // no type assertion needed
      } catch (error) {
        console.error(`Email not sent to ${to}.`);
        throw error;
      }
  };

export async function verifyEmail(email: string) {
  try {
    const response = await ses.verifyEmailAddress({ EmailAddress: email }).promise();
    console.log(`Verification email sent to ${email}`);
    console.log(response);
  } catch (error) {
    console.error(`Failed to verify ${email}.`, error);
  }
}

export async function isEmailVerified(email: string): Promise<boolean> {
  try {
    const response = await ses.getIdentityVerificationAttributes({ Identities: [email] }).promise();
    const attributes = response.VerificationAttributes[email];
    if (!attributes) {
      return false; // email is not verified
    }
    return attributes.VerificationStatus === 'Success'; // email is verified
  } catch (error) {
    console.error(`Failed to check email verification status for ${email}.`, error);
    return false;
  }
}


// Usage example
//verifyEmail('example@gmail.com');

  