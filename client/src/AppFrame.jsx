export default function AppFrame({ children }) {
  return (
    <section className="w-full flex flex-col items-center">
      <div className="mockup-phone ">
        <div className="mockup-phone-camera"></div>
        <div
          className="mockup-phone-display text-white place-content-baseline
            bg-neutral-900
            flex flex-col pt-8"
        >
          {children}
        </div>
      </div>
    </section>
  );
}
