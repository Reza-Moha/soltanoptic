"use client";

function Error({ error, reset }) {
  return (
    <div className="container xl:max-w-screen-xl">
      <div className="flex justify-center pt-10">
        <div>
          <h1 className="text-xl font-bold text-secondary-700 mb-8">
            {error.message}
          </h1>
          <button
            onClick={reset}
            className="flex items-center gap-x-2 text-secondary-500"
          >
            تلاش مجدد
          </button>
        </div>
      </div>
    </div>
  );
}
export default Error;
