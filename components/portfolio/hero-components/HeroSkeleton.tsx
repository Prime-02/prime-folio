export function HeroSkeleton() {
  return (
    <section className="w-full py-16 md:py-28" aria-label="Loading hero">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col-reverse md:grid md:grid-cols-[1fr_1fr] gap-10 md:gap-20 items-center animate-pulse">
          <div className="flex flex-col items-center text-center md:items-start md:text-left w-full">
            <div
              className="h-3 w-16 rounded-full mb-3"
              style={{ background: "var(--bg-tertiary)" }}
            />
            <div
              className="h-12 w-3/4 rounded-lg mb-2"
              style={{ background: "var(--bg-tertiary)" }}
            />
            <div
              className="h-6 w-1/2 rounded-lg mb-4"
              style={{ background: "var(--bg-tertiary)" }}
            />
            <div
              className="h-0.5 w-10 rounded-full mb-4"
              style={{ background: "var(--bg-tertiary)" }}
            />
            <div
              className="h-4 w-full rounded-lg mb-2"
              style={{ background: "var(--bg-tertiary)" }}
            />
            <div
              className="h-4 w-5/6 rounded-lg mb-5"
              style={{ background: "var(--bg-tertiary)" }}
            />
            <div
              className="h-5 w-64 rounded-lg mb-6"
              style={{ background: "var(--bg-tertiary)" }}
            />
            <div className="flex gap-2.5 mb-7">
              <div
                className="h-10 w-32 rounded-lg"
                style={{ background: "var(--bg-tertiary)" }}
              />
              <div
                className="h-10 w-32 rounded-lg"
                style={{ background: "var(--bg-tertiary)" }}
              />
              <div
                className="h-10 w-32 rounded-lg"
                style={{ background: "var(--bg-tertiary)" }}
              />
            </div>
            <div className="flex gap-2">
              <div
                className="h-8 w-16 rounded-lg"
                style={{ background: "var(--bg-tertiary)" }}
              />
              <div
                className="h-8 w-8 rounded-lg"
                style={{ background: "var(--bg-tertiary)" }}
              />
              <div
                className="h-8 w-8 rounded-lg"
                style={{ background: "var(--bg-tertiary)" }}
              />
              <div
                className="h-8 w-8 rounded-lg"
                style={{ background: "var(--bg-tertiary)" }}
              />
            </div>
          </div>
          <div className="flex flex-col items-center gap-4">
            <div
              className="w-40 h-40 sm:w-52 sm:h-52 rounded-full border-2"
              style={{
                background: "var(--bg-tertiary)",
                borderColor: "var(--border-color)",
              }}
            />
            <div
              className="h-6 w-32 rounded-full"
              style={{ background: "var(--bg-tertiary)" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}