const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const TEMP_DIR = path.join(__dirname, "../", "temp");

// اطمینان از وجود پوشه temp
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

const generateCustomerInvoicePdf = async (data) => {
  try {
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    // تنظیم اندازه صفحه
    await page.setViewport({ width: 790, height: 1000 });

    // اطمینان از اینکه داده‌ها مقدار دارند
    const prescriptions = Array.isArray(data.prescriptions)
      ? data.prescriptions
      : [];

    const htmlContent = `
        <!DOCTYPE html>
        <html lang="fa">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>فاکتور</title>
            <style>
                @page { size: 79mm auto; margin: 5mm; }
                body { font-family: Tahoma, Arial, sans-serif; direction: rtl; text-align: right; font-size: 12px; }
                h1 { text-align: center; font-size: 16px; }
                table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                th, td { border: 1px solid #000; padding: 5px; text-align: center; }
                th { background-color: #f2f2f2; }
            </style>
        </head>
        <body>

            <h1>🛍️ فاکتور فروش</h1>

            <h3>📝 مشخصات مشتری:</h3>
            <p><strong>👤 نام:</strong> ${data.fullName || "نامشخص"}</p>
            <p><strong>🆔 کد ملی:</strong> ${data.nationalId || "نامشخص"}</p>
            <p><strong>📞 شماره تماس:</strong> ${data.phoneNumber || "نامشخص"}</p>
            <p><strong>📄 شماره فاکتور:</strong> ${data.invoiceNumber || "نامشخص"}</p>
            <p><strong>💳 روش پرداخت:</strong> ${data.paymentMethod || "نامشخص"}</p>

            <h3>💰 جزئیات فاکتور:</h3>
            <table>
                <tr>
                    <th>شرح</th>
                    <th>مبلغ (تومان)</th>
                </tr>
                <tr><td>جمع کل</td><td>${data.SumTotalInvoice ?? "۰"}</td></tr>
                <tr><td>باقیمانده</td><td>${data.billBalance ?? "۰"}</td></tr>
                <tr><td>بیعانه</td><td>${data.deposit ?? "۰"}</td></tr>
                <tr><td>تخفیف</td><td>${data.discount ?? "۰"}</td></tr>
                <tr><td>مبلغ بیمه</td><td>${data.InsuranceAmount ?? "۰"}</td></tr>
                <tr><td>هزینه توصیف</td><td>${data.descriptionPrice ?? "۰"}</td></tr>
            </table>

            <h3>👓 نسخه‌های تجویزی:</h3>
            <table>
                <tr>
                    <th>چشم</th>
                    <th>SPH</th>
                    <th>CYL</th>
                    <th>AXE</th>
                    <th>PD</th>
                </tr>
                ${
                  prescriptions.length > 0
                    ? prescriptions
                        .map(
                          (prescription) => `
                    <tr>
                        <td>OD</td>
                        <td>${prescription.odSph ?? "-"}</td>
                        <td>${prescription.odCyl ?? "-"}</td>
                        <td>${prescription.odAx ?? "-"}</td>
                        <td rowspan="2">${prescription.pd ?? "-"}</td>
                    </tr>
                    <tr>
                        <td>OS</td>
                        <td>${prescription.osSph ?? "-"}</td>
                        <td>${prescription.osCyl ?? "-"}</td>
                        <td>${prescription.osAx ?? "-"}</td>
                    </tr>
                  `,
                        )
                        .join("")
                    : `<tr><td colspan="5">📌 نسخه‌ای موجود نیست.</td></tr>`
                }
            </table>

        </body>
        </html>
    `;

    // بارگذاری HTML در صفحه
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    // تولید نام فایل
    const fileName = `invoice_${data.invoiceNumber}_${Date.now()}.pdf`;
    const filePath = path.join(TEMP_DIR, fileName);

    // ذخیره PDF
    await page.pdf({
      path: filePath,
      width: "79mm",
      printBackground: true,
    });

    await browser.close();

    // بازگرداندن لینک دانلود
    return `${process.env.SERVERBASEURL}/temp/${fileName}`;
  } catch (error) {
    console.error("⚠️ خطا در ایجاد PDF:", error);
    return null;
  }
};

module.exports = generateCustomerInvoicePdf;
