import { getEnrolledPlayers } from "@/lib/players";
import { getViewer } from "@/lib/auth/profile";
import { EnrolledPlayerGrid } from "./EnrolledPlayerGrid";
import { SignUpSection } from "./SignUpSection";

export async function EnrolledSection() {
  const [players, viewer] = await Promise.all([
    getEnrolledPlayers(),
    getViewer(),
  ]);

  return (
    <div
      id="enroll"
      className="relative z-10 stone-bg border-t-2 border-black scroll-mt-16"
    >
      <div className="relative z-10 container mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16">
        <SignUpSection viewer={viewer} />
        <EnrolledPlayerGrid players={players} />
      </div>
    </div>
  );
}

export default EnrolledSection;
