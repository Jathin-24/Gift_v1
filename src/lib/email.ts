import nodemailer from "nodemailer";

export const sendOrderEmail = async (order: any, user: any) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail", // Requires "App Password" if using Gmail
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const itemsHtml = order.items.map((item: any) =>
            `<tr>
                <td style="padding: 10px; border-bottom: 1px solid #ccc;">${item.title}</td>
                <td style="padding: 10px; border-bottom: 1px solid #ccc;">${item.quantity}</td>
                <td style="padding: 10px; border-bottom: 1px solid #ccc;">₹${item.price}</td>
             </tr>`
        ).join("");

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER, // Send to Admin
            subject: `📦 New Order Received: #${order._id.toString().slice(-6).toUpperCase()}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #2563eb;">New Order Alert!</h1>
                    <p>You have received a new order from <strong>${user.name}</strong>.</p>
                    
                    <h3 style="border-bottom: 2px solid #eee; padding-bottom: 10px;">Customer Details</h3>
                    <p><strong>Name:</strong> ${order.shippingAddress.name}</p>
                    <p><strong>Email:</strong> ${order.shippingAddress.email}</p>
                    <p><strong>Phone:</strong> ${order.shippingAddress.phone || "N/A"}</p>
                    <p><strong>Address:</strong><br/>
                    ${order.shippingAddress.address}, ${order.shippingAddress.city},<br/>
                    ${order.shippingAddress.state} - ${order.shippingAddress.postalCode}</p>

                    <h3 style="border-bottom: 2px solid #eee; padding-bottom: 10px; margin-top: 20px;">Order Summary</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="background-color: #f8f9fa;">
                                <th style="text-align: left; padding: 10px;">Product</th>
                                <th style="text-align: left; padding: 10px;">Qty</th>
                                <th style="text-align: left; padding: 10px;">Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${itemsHtml}
                        </tbody>
                    </table>

                    <div style="margin-top: 20px; text-align: right;">
                        <h2>Total: ₹${order.total}</h2>
                        <span style="background-color: #16a34a; color: white; padding: 5px 10px; border-radius: 999px; font-size: 12px; font-weight: bold;">
                            ${order.paymentStatus.toUpperCase()}
                        </span>
                    </div>

                    <p style="margin-top: 40px; color: #666; font-size: 12px;">
                        This is an automated notification from your Store System.
                    </p>
                </div>
            `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent:", info.messageId);
        return true;
    } catch (error) {
        console.error("Email sending failed:", error);
        return false;
    }
};
