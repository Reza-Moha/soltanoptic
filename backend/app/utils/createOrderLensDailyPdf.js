const { launch } = require("puppeteer");

const path = require("path");
const { getInvoiceDetails } = require("./index");

const createPDF = async (invoiceId) => {
  const invoice = await getInvoiceDetails(invoiceId);
  if (!invoice) {
    throw new Error("Invoice not found");
  }
  const browser = await launch();
  const page = await browser.newPage();

  const content = `
    <html lang="fa">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: 'Vazir', Tahoma, Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f4f4f9;
          }
          .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          h1 {
            font-size: 24px;
            text-align: center;
            margin-bottom: 20px;
            color: #333;
          }
          .invoice-info {
          direction: rtl;
            margin-bottom: 30px;
          }
          .invoice-info p {
            margin: 5px 0;
            font-size: 14px;
          }
          .invoice-info strong {
            font-weight: bold;
          }
          .prescription-table {
            width: 100%;
            margin-top: 20px;
            border-collapse: collapse;
          }
          .prescription-table th,
          .prescription-table td {
            padding: 10px;
            text-align: right;
            border: 1px solid #ddd;
          }
          .prescription-table th {
            background-color: #f1f1f1;
            font-size: 16px;
          }
          .prescription-table td {
            font-size: 14px;
          }
          .lens-info {
            margin-top: 10px;
            background-color: #e8f7e1;
            padding: 10px;
            border-radius: 5px;
           text-align: center;
          }
          .lens-info p {
            margin: 3px 0;
            font-size: 12px;
          }
          .footer {
          direction: rtl;
            text-align: center;
            margin-top: 30px;
            font-size: 12px;
            color: #777;
          }
         
          .moshakhasatTitr{
          text-align: right;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>گزارش فاکتور شماره ${invoice.invoiceNumber}</h1>
          <div class="invoice-info">
            <p><strong>نام مشتری:</strong> ${invoice.customer.fullName} (${invoice.customer.gender})</p>
            <p><strong>نام کارمند:</strong> ${invoice.employee.fullName}</p>
            <p><strong>نام شرکت:</strong> ${invoice.company.companyName}</p>
          </div>

          <h2 class="moshakhasatTitr">مشخصات نسخه‌های تجویزی:</h2>
          <table class="prescription-table">
            <thead>
              <tr>
                <th>OD (راست)</th>
                <th>OS (چپ)</th>
                <th>PD</th>
                <th>نوع فریم</th>
                <th>لنز</th>
              </tr>
            </thead>
            <tbody>
              ${invoice.prescriptions
                .map((prescription) => {
                  return `
                    <tr>
                      <td>${prescription.odSph} / ${prescription.odCyl} / ${prescription.odAx}</td>
                      <td>${prescription.osSph} / ${prescription.osCyl} / ${prescription.osAx}</td>
                      <td>${prescription.pd}</td>
                      <td>${prescription.label}</td>
                      <td>${prescription.lens ? prescription.lens.lensName : "ندارد"}</td>
                    </tr>
                  `;
                })
                .join("")}
            </tbody>
          </table>

          <div class="lens-info">
            <p><strong>تاریخ صدور:</strong> ${new Date(invoice.createdAt).toLocaleDateString("fa-IR")}</p>
          </div>

          <div class="footer">
            <p>سلطان اپتیک</p>
            <p>آدرس:ارومیه خیابان برق نبش خیابان بهشتی منش (هواشناسی سابق) شماره تماس:0443-365-4088</p>
          </div>
        </div>
      </body>
    </html>
  `;

  await page.setContent(content);
  const pdfPath = path.join(
    __dirname,
    "../public/orderLensDaily",
    `invoice-${invoice.InvoiceId}.pdf`,
  );
  await page.pdf({ path: pdfPath, format: "A4" });
  await browser.close();
  return { pdfPath, fileName: `invoice-${invoice.InvoiceId}.pdf` };
};

module.exports = {
  createPDF,
};
