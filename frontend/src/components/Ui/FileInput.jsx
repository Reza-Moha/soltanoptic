function FileInput({
  name,
  label,
  accept,
  onChange,
  id = `file-input-${name}`,
  className = "",
  ...props
}) {
  return (
    <div className={`file-input ${className}`}>
      <label
        htmlFor={id}
        className="flex items-center justify-center w-32 h-9 rounded bg-slate-500 text-white cursor-pointer"
      >
        {label || "انتخاب تصویر"}
      </label>

      <input
        type="file"
        name={name}
        id={id}
        accept={accept}
        className="hidden"
        onChange={onChange}
        {...props}
      />
    </div>
  );
}

export default FileInput;
