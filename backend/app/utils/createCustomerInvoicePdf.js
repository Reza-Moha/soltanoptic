const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const {
  convertToPersianNumber,
  formatNumberWithCommas,
  formatToPersianDate,
} = require("./index");

const TEMP_DIR = path.join(__dirname, "../", "temp");
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

const fontBuffer = fs.readFileSync(
  path.join(__dirname, "../", "public/font/IRANSansWeb.ttf"),
);
const fontBase64 = fontBuffer.toString("base64");
const fontDataUrl = `data:font/ttf;base64,${fontBase64}`;

const generateCustomerInvoicePdf = async (data, invoiceNumber, employee) => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 790, height: 790 });

    await page.addStyleTag({
      content: `
        @font-face {
          font-family: 'IRANSans';
     src: url('${fontDataUrl}') format('truetype');
          font-weight: normal;
          font-style: normal;
        }
        body {
          font-family: 'IRANSans', Arial, sans-serif;
          direction: rtl;
          text-align: right;
        }
      `,
    });

    const { paymentInfo, insurance, prescriptions, createdAt, company } =
      data.customerInvoices[0];

    const contentHeight = await page.evaluate(() => {
      return document.body.scrollHeight;
    });

    const htmlContent = `
        <!DOCTYPE html>
        <html lang="fa">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
           
            <title>قبض ${invoiceNumber}</title>
               <link href="file://${path.join(
                 __dirname,
                 "../public/css/styles.css",
               )}" rel="stylesheet">
            <style type="text/css">
                .tg {
                    border-collapse: collapse;
                    border-spacing: 0;
                    width: 100%;
                    text-align: center;
                    font-size: 14px;
                }
                .tg td, .tg th {
                    border: 1px solid black;
                    padding: 10px;
                }
                .tg th {
                    background-color: #f3f3f3;
                }
            </style>
              <script src="https://unpkg.com/@tailwindcss/browser@4"></script>
        </head>
        <body>
        <table class="tg">
            <thead>
                <tr>
                    <th colspan="9">${invoiceNumber} - سلطان اپتیک</th>
                </tr>
            </thead>
       <tbody>
  ${
    prescriptions.length > 0
      ? prescriptions
          .map(
            (prescription) => `
      <tr>
          <td>${prescription.label || ""}</td>
          <td colspan="2">SPH</td>
          <td colspan="2">CYL</td>
          <td>AXE</td>
          <td colspan="3">PD: ${prescription.pd || ""}</td>
      </tr>
      <tr>
          <td>OD</td>
          <td colspan="2">${prescription.odSph || ""}</td>
          <td colspan="2">${prescription.odCyl || ""}</td>
          <td>${prescription.odAx || ""}</td>
          <td colspan="3">${prescription.lens?.lensName || ""}</td>
      </tr>
      <tr>
          <td>OS</td>
          <td colspan="2">${prescription.osSph || ""}</td>
          <td colspan="2">${prescription.osCyl || ""}</td>
          <td>${prescription.osAx || ""}</td>
          <td colspan="3">${prescription.frame?.serialNumber || ""}</td>
      </tr>`,
          )
          .join("")
      : ""
  }

  <tr>
    <td colspan="5">${data.gender || ""} ${data.fullName || ""}</td>
    <td colspan="4">نام مشتری</td>
  </tr>
  <tr>
    <td colspan="5">${convertToPersianNumber(data.phoneNumber || "")}</td>
    <td colspan="4">شماره تماس</td>
  </tr>
  <tr>
    <td colspan="5" dir="rtl" style="text-align: center;">${formatToPersianDate(createdAt)}</td>
    <td colspan="4">تاریخ سفارش</td>
  </tr>
  ${
    paymentInfo?.SumTotalInvoice
      ? `
  <tr>
    <td colspan="5">${formatNumberWithCommas(paymentInfo.SumTotalInvoice)}</td>
    <td colspan="4">مبلغ کل</td>
  </tr>`
      : ""
  }
  ${
    paymentInfo?.discount
      ? `
  <tr>
    <td colspan="5">${formatNumberWithCommas(paymentInfo.discount)}</td>
    <td colspan="4">تخفیف</td>
  </tr>`
      : ""
  }
  ${
    paymentInfo?.deposit
      ? `
  <tr>
    <td colspan="5">${formatNumberWithCommas(paymentInfo.deposit)}</td>
    <td colspan="4">دریافتی</td>
  </tr>`
      : ""
  }
  ${
    paymentInfo?.billBalance
      ? `
  <tr>
    <td colspan="5">${formatNumberWithCommas(paymentInfo.billBalance)}</td>
    <td colspan="4">باقیمانده</td>
  </tr>`
      : ""
  }
  ${
    insurance?.insuranceName
      ? `
  <tr>
    <td colspan="5">${insurance.insuranceName}</td>
    <td colspan="4">نوع بیمه</td>
  </tr>`
      : ""
  }
  ${
    employee?.fullName
      ? `
  <tr>
    <td colspan="5">${employee.fullName}</td>
    <td colspan="4">فروشنده</td>
  </tr>`
      : ""
  }
  ${
    paymentInfo?.paymentMethod
      ? `
  <tr>
    <td colspan="5">${paymentInfo.paymentMethod}</td>
    <td colspan="4">نحوه پرداخت</td>
  </tr>`
      : ""
  }
  ${
    company?.companyName
      ? `
  <tr>
    <td colspan="5">${company.companyName}</td>
    <td colspan="4">سفارش عدسی از</td>
  </tr>`
      : ""
  }
</tbody>

        </table>
        </body>
        </html>
    `;

    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    const fileName = `invoice_${invoiceNumber}-${Date.now()}.pdf`;
    const filePath = path.join(TEMP_DIR, fileName);

    await page.pdf({
      path: filePath,
      width: "79mm",
      height: `${contentHeight}px`,
      scale: 1,
      printBackground: true,
      preferCSSPageSize: true,
      clip: { x: 0, y: 0, width: 790, height: contentHeight },
    });

    await browser.close();

    return `${process.env.SERVERBASEURL}:5000/temp/${fileName}`;
  } catch (error) {
    console.error("⚠️ خطا در ایجاد PDF:", error);
    return null;
  }
};

module.exports = generateCustomerInvoicePdf;
