import { PollList } from "@/components/PollList";
import { CreatePollForm } from "@/components/CreatePollForm";

export default function HomePage() {
  return (
    <div className="flex flex-col md:flex-row w-full gap-8">
      {/* Lewa strona - Lista ankiet */}
      <section className="flex-1 bg-white/10 p-6 rounded-2xl shadow-2xl">
        <PollList />
      </section>

      {/* Prawa strona - Formularz tworzenia ankiety */}
      <section className="w-full md:w-1/3 bg-white/10 p-6 rounded-2xl shadow-2xl">
        <CreatePollForm />
      </section>
    </div>
  );
}
