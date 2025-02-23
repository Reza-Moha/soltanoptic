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
            <title>قبض${invoiceNumber}</title>
            <style type="text/css">
.tg  {border-collapse:collapse;border-spacing:0;}
.tg td{border-color:black;border-style:solid;border-width:1px;font-family:Arial, sans-serif;font-size:14px;
  overflow:hidden;padding:10px 5px;word-break:normal;}
.tg th{border-color:black;border-style:solid;border-width:1px;font-family:Arial, sans-serif;font-size:14px;
  font-weight:normal;overflow:hidden;padding:10px 5px;word-break:normal;}
.tg .tg-us0j{border-color:inherit;font-family:Tahoma, Geneva, sans-serif !important;font-size:medium;font-weight:bold;
  text-align:left;vertical-align:top}
.tg .tg-b6f9{border-color:inherit;font-family:Tahoma, Geneva, sans-serif !important;font-size:medium;font-weight:bold;
  text-align:center;vertical-align:top}
.tg .tg-c3ow{border-color:inherit;text-align:center;vertical-align:top}
.tg .tg-6pot{border-color:inherit;font-family:Tahoma, Geneva, sans-serif !important;font-weight:bold;text-align:center;
  vertical-align:top}
.tg .tg-yn58{border-color:inherit;font-family:Tahoma, Geneva, sans-serif !important;font-size:medium;text-align:center;
  vertical-align:top}
.tg .tg-6sbi{border-color:inherit;font-family:Tahoma, Geneva, sans-serif !important;font-size:medium;text-align:left;
  vertical-align:top}
.tg .tg-0pky{border-color:inherit;text-align:left;vertical-align:top}
.tg .tg-0lax{text-align:left;vertical-align:top}
.tg .tg-rlus{font-family:Tahoma, Geneva, sans-serif !important;font-weight:bold;text-align:center;vertical-align:top}
</style>
        </head>
        <body>
       <table class="tg"><thead>
  <tr>
    <th class="tg-yn58" colspan="9" rowspan="2">سلطان اپتیک</th>
  </tr>
  <tr>
  </tr></thead>
<tbody>
  ${
    prescriptions.length > 0
      ? prescriptions.map((prescription, index) => {
          return `<tr>
    <td class="tg-yn58">frameType</td>
    <td class="tg-b6f9" colspan="2">SPH</td>
    <td class="tg-b6f9" colspan="2">CYL</td>
    <td class="tg-b6f9">AXE</td>
    <td class="tg-us0j" colspan="3">PD</td>
  </tr>
  <tr>
    <td class="tg-b6f9">OD</td>
    <td class="tg-yn58" colspan="2"></td>
    <td class="tg-yn58" colspan="2"></td>
    <td class="tg-yn58"></td>
    <td class="tg-6sbi" colspan="3">Lens</td>
  </tr>
  <tr>
    <td class="tg-b6f9">OS</td>
    <td class="tg-yn58" colspan="2"></td>
    <td class="tg-yn58" colspan="2"></td>
    <td class="tg-yn58"></td>
    <td class="tg-6sbi" colspan="3">Frame</td>
  </tr>`;
        })
      : null
  }
  <tr>
    <td class="tg-yn58" colspan="5"></td>
    <td class="tg-b6f9" colspan="4">نام بیمار</td>
  </tr>
  <tr>
    <td class="tg-yn58" colspan="5"></td>
    <td class="tg-b6f9" colspan="4">شماره تماس</td>
  </tr>
  <tr>
    <td class="tg-yn58" colspan="5"></td>
    <td class="tg-b6f9" colspan="4">تاریخ سفارش</td>
  </tr>
  <tr>
    <td class="tg-yn58" colspan="5"></td>
    <td class="tg-b6f9" colspan="4">مبلغ کل</td>
  </tr>
  <tr>
    <td class="tg-c3ow" colspan="5"></td>
    <td class="tg-6pot" colspan="4">تخفیف</td>
  </tr>
  <tr>
    <td class="tg-0pky" colspan="5"></td>
    <td class="tg-6pot" colspan="4">دریافتی</td>
  </tr>
  <tr>
    <td class="tg-0pky" colspan="5"></td>
    <td class="tg-6pot" colspan="4">باقیمانده</td>
  </tr>
  <tr>
    <td class="tg-0lax" colspan="5"></td>
    <td class="tg-rlus" colspan="4">نوع بیمه</td>
  </tr>
  <tr>
    <td class="tg-0lax" colspan="5"></td>
    <td class="tg-rlus" colspan="4">فروشنده</td>
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
