export default function Appointments() {
  return (
    <div className="relative min-h-[calc(100vh-120px)] overflow-hidden rounded-3xl">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-50 via-white to-slate-100" />

      {/* Decorative Blobs */}
      <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-blue-200/30 blur-3xl" />
      <div className="absolute right-0 top-20 h-96 w-96 rounded-full bg-violet-200/30 blur-3xl" />
      <div className="absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-200/20 blur-3xl" />

      {/* Content */}
      <div className="relative flex h-full flex-col items-center justify-center px-6 py-24 text-center">
        <div className="max-w-3xl">
          <h1 className="bg-gradient-to-r from-neutral-900 via-neutral-700 to-neutral-500 bg-clip-text text-6xl font-bold tracking-tight text-transparent ">
            How are you feeling today?
          </h1>

          <p className="mt-6 text-lg text-neutral-600">
            I'm here to listen, support you, and help you work through whatever
            is on your mind.
          </p>

          {/* Chat Input */}
          <div className="mx-auto mt-12 flex max-w-2xl items-center gap-3 rounded-2xl border border-neutral-200 bg-white/80 p-3 shadow-xl backdrop-blur">
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 bg-transparent px-3 py-2 text-neutral-900 outline-none placeholder:text-neutral-400"
            />

            <button className="rounded-xl bg-black px-6 py-2 font-medium text-white transition hover:bg-neutral-800">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}