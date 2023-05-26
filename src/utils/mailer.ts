import { createTransport } from "nodemailer";
import { env } from "~/env.mjs";

const transport = createTransport(env.SMTP_SERVER);

const notificationText = (ticket: Ticket) => `
    New ticket from ${ticket.email} on Bubbly
    Ticket User Email: ${ticket.email}
    Ticket Message: ${ticket.message}
`;

const sendTicketNotification = async (ticket: Ticket, email: string) => {
    const result = await transport.sendMail({
        to: email,
        from: env.SMTP_FROM,
        subject: `New ticket from on Bubbly`,
        text: notificationText(ticket),
    });
    const failed = result.rejected.concat(result.pending).filter(Boolean);
    if (failed.length) {
        throw new Error(`Email(s) (${failed.join(", ")}) could not be sent`);
    }
}

export default sendTicketNotification;