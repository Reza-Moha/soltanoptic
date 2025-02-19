import Button from "./Button";

export default function SubmitBtn({ children, disabled = false }) {
  return (
    <div className="w-full inline-flex items-center">
      <Button
        type="submit"
        variant="primary"
        className="my-4 w-full lg:w-1/2 md:mx-auto py-2 rounded disabled:opacity-40"
        disabled={disabled}
      >
        {children}
      </Button>
    </div>
  );
}
