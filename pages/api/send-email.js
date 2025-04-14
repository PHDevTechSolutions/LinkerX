import axios from "axios";

// Mailjet API credentials
const apiKey = "2541c8283c5f03a0ffd562ea1018cdaa";
const apiSecret = "3f965d529872432598c593aed0acde12";

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { recepient, subject, message } = req.body;

        const sender = "survey.ecoshiftcorporation@gmail.com"; // Static sender

        // Sanitize and validate email addresses
        if (!recepient || !subject || !message) {
            return res.status(400).json({ success: false, message: "All fields are required." });
        }

        if (!validateEmail(sender) || !validateEmail(recepient)) {
            return res.status(400).json({ success: false, message: "Invalid email address." });
        }

        const body = {
            Messages: [
                {
                    From: {
                        Email: sender,
                        Name: "Ecoshift (Taskflow)",
                    },
                    To: [
                        {
                            Email: recepient,
                            Name: "Customer",
                        },
                    ],
                    Subject: subject,
                    HTMLPart: message,
                },
            ],
        };

        try {
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

function validateEmail(email) {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
}
