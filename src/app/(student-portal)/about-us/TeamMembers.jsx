"use client";
import InstructorItem from "@/components/instructor/InstructorItem";
import { useFetch } from "@/utils/useCustomHook";
import "./team-members.css";

const TeamMembers = () => {
  const { data } = useFetch("/api/cms/team-members?page=1&limit=50");

  if (!data) {
    return null;
  }

  return (
    <section className="team-members">
      <div className="container">
        <div className="team-members-lists top flex">
          {[...data.results.slice(0, 3)].map((item) => (
            <InstructorItem type key={item.id + item.fullName} data={item} />
          ))}
        </div>
        <div className="team-members-lists bottom flex">
          {[...data.results.slice(3)].map((item) => (
            <InstructorItem type key={item.id + item.fullName} data={item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamMembers;
