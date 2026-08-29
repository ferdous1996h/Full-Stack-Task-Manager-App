
export default function ErrorMSG({ error }) {
  return (
    <div className="mockup-code w-full  h-full mt-10">
      <pre data-prefix="$">
        <code>App is starting...</code>
      </pre>
      <pre data-prefix="$" className="text-warning">
        <code>Opps.There is a problem !</code>
      </pre>
      <pre data-prefix=">" className="text-error">
        <code>{error}.</code>
      </pre>
    </div>
  );
}
