const PDFDocument = require('pdfkit');

const generateTicketPDF = (booking) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: [600, 300],
      margin: 0,
    });

    const buffers = [];
    doc.on('data', (chunk) => buffers.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.on('error', reject);

    // Background
    doc.rect(0, 0, 600, 300).fill('#4F46E5');

    // White card area
    doc.roundedRect(20, 20, 560, 260, 10).fill('#FFFFFF');

    // Left accent bar
    doc.rect(20, 20, 8, 260).fill('#4F46E5');

    // Header
    doc.fontSize(10).fillColor('#6B7280').text('EVENT TICKET', 50, 35, { width: 300 });
    doc.fontSize(22).fillColor('#1F2937').text(booking.event.title, 50, 52, { width: 350 });

    // Divider
    doc.moveTo(50, 95).lineTo(400, 95).strokeColor('#E5E7EB').lineWidth(1).stroke();

    // Details
    const detailY = 110;
    doc.fontSize(9).fillColor('#6B7280').text('DATE', 50, detailY);
    doc.fontSize(12).fillColor('#1F2937').text(
      new Date(booking.event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      50, detailY + 14
    );

    doc.fontSize(9).fillColor('#6B7280').text('LOCATION', 50, detailY + 40);
    doc.fontSize(12).fillColor('#1F2937').text(booking.event.location, 50, detailY + 54);

    doc.fontSize(9).fillColor('#6B7280').text('ATTENDEE', 50, detailY + 80);
    doc.fontSize(12).fillColor('#1F2937').text(booking.user.name, 50, detailY + 94);

    // Right panel - ticket info
    doc.rect(420, 20, 160, 260).fill('#F9FAFB');
    doc.roundedRect(420, 20, 160, 260, 10).fill('#F9FAFB');

    doc.fontSize(9).fillColor('#6B7280').text('TIER', 440, 40);
    doc.fontSize(14).fillColor('#4F46E5').text(booking.ticketTier, 440, 56);

    doc.fontSize(9).fillColor('#6B7280').text('QUANTITY', 440, 85);
    doc.fontSize(14).fillColor('#1F2937').text(String(booking.quantity), 440, 101);

    doc.fontSize(9).fillColor('#6B7280').text('TOTAL', 440, 130);
    doc.fontSize(18).fillColor('#4F46E5').text(`$${booking.totalPrice}`, 440, 146);

    doc.fontSize(9).fillColor('#6B7280').text('TICKET ID', 440, 190);
    doc.fontSize(8).fillColor('#1F2937').text(booking.ticketId, 440, 206, { width: 120 });

    doc.fontSize(9).fillColor('#6B7280').text('STATUS', 440, 240);
    doc.fontSize(12).fillColor('#10B981').text('PAID', 440, 256);

    doc.end();
  });
};

module.exports = { generateTicketPDF };
