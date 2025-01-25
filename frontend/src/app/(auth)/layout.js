export const metadata = {
  title: "صفحه ورود|ثبت نام",
  description: "صفحه ورود | ثبت نام مجموعه سلطان اپتیک",
};

export default function AuthLayout({ children }) {
  return (
    <section className="min-h-screen overflow-hidden bg-white flex items-center justify-center">
      {children}
    </section>
  );
}
