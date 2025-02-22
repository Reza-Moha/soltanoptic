const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const TEMP_DIR = path.join(__dirname, "../", "temp");
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

const generateCustomerInvoicePdf = async (data, invoiceNumber, employee) => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    // تنظیم اندازه صفحه
    await page.setViewport({ width: 790, height: 1000 });

    const { paymentInfo, insurance, prescriptions } = data.customerInvoices[0];

    const htmlContent = `
        <!DOCTYPE html>
        <html lang="fa">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>فاکتور</title>
            <style>
                @page { size: 79mm auto; margin: 5mm; }
                body { font-family: Tahoma, sans-serif; font-size: 12px; }
                .tg  {width: 100%;height: 100%;border-collapse:collapse;border-color:#bbb;border-spacing:0;}
.tg td{background-color:#E0FFEB;border-color:#bbb;border-style:solid;border-width:1px;color:#594F4F;
  font-family:Arial, sans-serif;font-size:14px;overflow:hidden;padding:10px 5px;word-break:normal;}
.tg th{background-color:#9DE0AD;border-color:#bbb;border-style:solid;border-width:1px;color:#493F3F;
  font-family:Arial, sans-serif;font-size:14px;font-weight:normal;overflow:hidden;padding:10px 5px;word-break:normal;}
.tg .tg-baqh{text-align:center;vertical-align:top}
.tg .tg-c3ow{border-color:inherit;text-align:center;vertical-align:top}
.tg .tg-0lax{text-align:left;vertical-align:top}
            </style>
        </head>
        <body>
        <table class="tg"><thead>
  <tr>
    <th class="tg-c3ow" colspan="8"></th>
  </tr></thead>
<tbody>
  <tr>
    <td class="tg-c3ow" colspan="4">${invoiceNumber}</td>
    <td class="tg-c3ow" colspan="4">شماره قبض</td>
  </tr>
  <tr>
    <td class="tg-c3ow" colspan="4">${data.fullName}</td>
    <td class="tg-c3ow" colspan="4">نام مشتری</td>
  </tr>
  <tr>
    <td class="tg-c3ow" colspan="4">${data.phoneNumber}</td>
    <td class="tg-c3ow" colspan="4">شماره تماس</td>
  </tr>
  ${
    prescriptions.length > 0
      ? prescriptions
          .map(
            (prescription) => `
                    <tr>
    <td class="tg-c3ow">${prescription.label}</td>
    <td class="tg-c3ow">SPH</td>
    <td class="tg-c3ow">CYL</td>
    <td class="tg-c3ow">AX</td>
    <td class="tg-c3ow" colspan="4">PD:${prescription.pd}</td>
  </tr>
  <tr>
    <td class="tg-c3ow">OD</td>
    <td class="tg-c3ow">${prescription.odSph}</td>
    <td class="tg-c3ow">${prescription.odCyl}</td>
    <td class="tg-c3ow">${prescription.odAx}</td>
    <td class="tg-c3ow" colspan="2">تستس</td>
    <td class="tg-c3ow" colspan="2">عدسی</td>
  </tr>
  <tr>
    <td class="tg-c3ow">OS</td>
    <td class="tg-c3ow">${prescription.osSph}</td>
    <td class="tg-c3ow">${prescription.osCyl}</td>
    <td class="tg-c3ow">${prescription.osAx}</td>
    <td class="tg-c3ow" colspan="2">تستی</td>
    <td class="tg-c3ow" colspan="2">فریم</td>
  </tr>
                  `,
          )
          .join("")
      : `<tr><td colspan="5">📌 نسخه‌ای موجود نیست.</td></tr>`
  }
  
  <tr>
    <td class="tg-c3ow" colspan="4">${paymentInfo.SumTotalInvoice}</td>
    <td class="tg-c3ow" colspan="4">جمع کل</td>
  </tr>
  <tr>
    <td class="tg-baqh" colspan="4">${paymentInfo.deposit}</td>
    <td class="tg-baqh" colspan="4">مبلغ پرداختی</td>
  </tr>
  <tr>
    <td class="tg-baqh" colspan="4">${insurance.insuranceName}</td>
    <td class="tg-baqh" colspan="4">نوع بیمه</td>
  </tr>
  <tr>
    <td class="tg-baqh" colspan="4">${paymentInfo.insuranceAmount}</td>
    <td class="tg-baqh" colspan="4">حواله بیمه</td>
  </tr>
  <tr>
    <td class="tg-baqh" colspan="4">${paymentInfo.discount}</td>
    <td class="tg-baqh" colspan="4">تخفیف</td>
  </tr>
  <tr>
    <td class="tg-0lax" colspan="4">${paymentInfo.billBalance}</td>
    <td class="tg-baqh" colspan="4">مانده قبض</td>
  </tr>
  <tr>
    <td class="tg-0lax" colspan="4">${employee.fullName}</td>
    <td class="tg-baqh" colspan="4">مسئول فروش</td>
  </tr>
</tbody></table>
               
        </body>
        </html>
    `;

    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    const fileName = `invoice_${invoiceNumber}-${Date.now()}.pdf`;
    const filePath = path.join(TEMP_DIR, fileName);

    await page.pdf({
      path: filePath,
      width: "79mm",
      printBackground: true,
    });

    await browser.close();

    return `${process.env.SERVERBASEURL}:5000/temp/${fileName}`;
  } catch (error) {
    console.error("⚠️ خطا در ایجاد PDF:", error);
    return null;
  }
};

module.exports = generateCustomerInvoicePdf;
