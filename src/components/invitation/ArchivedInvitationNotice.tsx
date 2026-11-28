export default function ArchivedInvitationNotice() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FAF7F2] px-4 py-16 text-center">
      <div className="max-w-md rounded-2xl border border-[#B69A70]/50 bg-white p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#96752d]">
          Aahvaaan
        </p>
        <h1 className="mt-3 font-serif text-3xl text-[#0E4D4F]">
          This invitation is no longer active
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-stone-600">
          The hosts have archived this wedding invitation. Thank you for visiting.
        </p>
      </div>
    </main>
  );
}
