import localFont from "next/font/local";
export const fontKalame = localFont({
  src: [
    {
      path: "../assets/fonts/Kalame/KalamehRegular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/Kalame/KalamehBlack.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../assets/fonts/Kalame/KalamehBold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../assets/fonts/Kalame/KalamehThin.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-kalame",
  display: "block",
});
export const fontIranSans = localFont({
  src: [
    {
      path: "../assets/fonts/iranSans/IRANSansWeb.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/iranSans/IRANSansWeb_UltraLight.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../assets/fonts/iranSans/IRANSansWeb_Light.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../assets/fonts/iranSans/IRANSansWeb_Medium.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../assets/fonts/iranSans/IRANSansWeb_Bold.ttf",
      weight: "800",
      style: "normal",
    },
  ],
  variable: "--font-iranSans",
  display: "block",
});
