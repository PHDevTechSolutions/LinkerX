import axios from "axios";

// Mailjet API credentials
const apiKey = "2541c8283c5f03a0ffd562ea1018cdaa";
const apiSecret = "3f965d529872432598c593aed0acde12";

// Survey link
const surveyLink = "https://us3.list-manage.com/survey?u=77f60046e24103f876322654d&id=ab6262deaa&attribution=false";

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { email } = req.body;

        // Sanitize and validate the email address
        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required." });
        }

        if (!validateEmail(email)) {
            return res.status(400).json({ success: false, message: "Invalid email address." });
        }

        const subject = "Ecoshift Corporation Shopping Experience Survey";
        const htmlContent = `
      <p>Greetings</p>
      <p>Thank you for choosing Ecoshift Corporation for your shopping needs!</p>
      <p>We would greatly appreciate it if you could take a moment to complete a brief customer survey to share your feedback with us.</p>
      <p>Please click the link below to complete the survey:</p>
      <p><a href="${surveyLink}">${surveyLink}</a></p>
    `;

        // Prepare the Mailjet payload
        const body = {
            Messages: [
                {
                    From: {
                        Email: "survey.ecoshiftcorporation@gmail.com", // Replace with your sender email
                        Name: "Ecoshift (Taskflow) - Survey",
                    },
                    To: [
                        {
                            Email: email,
                            Name: "Customer", // Default name as we no longer have contactPerson
                        },
                    ],
                    Subject: subject,
                    HTMLPart: htmlContent,
                },
            ],
        };

        try {
            // Send email using Mailjet API
            const response = await axios.post("https://api.mailjet.com/v3.1/send", body, {
                auth: {
                    username: apiKey,
                    password: apiSecret,
                },
            });

            if (response.status === 200 && response.data.Messages[0].Status === "success") {
                return res.status(200).json({ success: true, message: "Email sent successfully!" });
            } else {
                return res.status(500).json({ success: false, message: "Failed to send email." });
            }
        } catch (error) {
            console.error("Mailjet error:", error);
            return res.status(500).json({ success: false, message: "Failed to send email." });
        }
    } else {
        return res.status(405).json({ success: false, message: "Invalid request method" });
    }
}

// Email validation function
function validateEmail(email) {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
}
