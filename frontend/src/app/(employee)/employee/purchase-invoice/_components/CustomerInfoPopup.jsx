"use client";
import { sendSmsPurchaseApi } from "@/services/customers/customers.service";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { IoCheckmarkDoneCircle, IoPrintSharp } from "react-icons/io5";
import { MdDownloadDone } from "react-icons/md";
import { BeatLoader } from "react-spinners";
import { TiMessage } from "react-icons/ti";
import { FaPrint } from "react-icons/fa6";
export const CustomerInfoPopup = ({
  customerInfo,
  setShowModal,
  invoiceNumber,
}) => {
  const [sendingSms, setSendingSms] = useState(0);
  console.log(customerInfo);
  const sendSmsThanksForThePurchaseHandler = async (values, e) => {
    try {
      setSendingSms(1);
      e.stopPropagation();
      const data = await sendSmsPurchaseApi(values);
      if (data.statusCode === 200) {
        toast.success(data.message);
        setSendingSms(2);
      }
    } catch (e) {
      console.log(e);
      setSendingSms(0);
    }
  };

  const printInvoicePdf = async () => {
    if (!customerInfo.invoicePdf) {
      toast.error("لینک قبض موجود نیست!");
      return;
    }

    try {
      const response = await fetch(customerInfo.invoicePdf, {
        method: "GET",
      });
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        toast.error("باز کردن پنجره چاپ با شکست مواجه شد");
        return;
      }

      printWindow.document.write(`
      <html>
        <head>
          <style>
            @media print {
              body {
                margin: 0;
                padding: 0;
              }
              embed {
                width: 790px !important;
                height: 100vh;
              }
            }
            body, html {
              margin: 0;
              padding: 0;
              overflow: hidden;
            }
            embed {
              width: 100%;
              height: 100vh;
            }
          </style>
        </head>
        <body>
          <embed src="${blobUrl}" type="application/pdf" />
        </body>
      </html>
    `);
      printWindow.document.close();

      printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();
        URL.revokeObjectURL(blobUrl);
      };
    } catch (error) {
      console.error("خطا در چاپ PDF:", error);
      toast.error("چاپ قبض با شکست مواجه شد");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={() => setShowModal(false)}
    >
      <div
        className="bg-white rounded-lg shadow-lg p-6 w-11/12 md:w-1/2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-center border-b border-green-100 mb-2 gap-x-2">
          <IoCheckmarkDoneCircle
            size={35}
            className="text-green-500 bg-green-50 animate-bounce"
          />

          <p>{`قبض ${customerInfo.fullUserData.fullName} به شماره ${invoiceNumber} با موفقیت ذخیره شد.`}</p>
        </div>
        <div className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 justify-items-center gap-4">
            <div className="col-span-1 flex items-center gap-2 bg-blue-200 text-blue-500 rounded  transition-all ease-linear duration-300">
              {sendingSms === 2 && (
                <div className="flex item-center justify-center gap-x-2 px-1 py-2 select-none">
                  <button className="text-sm ">پیامک ارسال شد</button>
                  <MdDownloadDone />
                </div>
              )}
              {sendingSms === 1 && (
                <div className="flex item-center justify-center gap-x-2 px-1 py-2 select-none">
                  <button className="text-sm ">درحال ارسال پیامک</button>
                  <BeatLoader size={8} />
                </div>
              )}
              {sendingSms === 0 && (
                <>
                  <div
                    className="hover:bg-blue-400 px-2 flex items-center justify-center gap-2 rounded  hover:text-white cursor-pointer "
                    onClick={(e) =>
                      sendSmsThanksForThePurchaseHandler(
                        {
                          invoiceNumber,
                          phoneNumber: customerInfo.phoneNumber,
                          gender: customerInfo.gender,
                          customerName: customerInfo.fullName,
                        },
                        e,
                      )
                    }
                  >
                    <button className="px-1 py-2 text-sm">ارسال پیامک</button>
                    <TiMessage size={20} />
                  </div>
                </>
              )}
            </div>
            <div
              onClick={printInvoicePdf}
              className="col-span-1 flex px-2 items-center justify-center gap-2 bg-green-200 text-green-500 rounded hover:bg-green-400 hover:text-white transition-all ease-linear duration-300 cursor-pointer"
            >
              <button className="px-1 py-2 text-sm">چاپ قبض</button>
              <IoPrintSharp size={20} />
            </div>
            <div className="col-span-1 px-2 flex items-center justify-center gap-2 bg-orange-200 text-orange-500 rounded hover:bg-orange-400 hover:text-white transition-all ease-linear duration-300 cursor-pointer">
              <button className="px-1 py-2 text-sm">صدور فاکتور</button>

              <FaPrint size={18} />
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setShowModal(false)}
          className="mt-4 px-1 py-1 bg-rose-500 text-sm text-white rounded hover:bg-rose-600"
        >
          بستن
        </button>
      </div>
    </div>
  );
};
