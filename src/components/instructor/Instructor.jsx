import { baseURL } from "@/services/api/apiService";
import InstructorSlider from "./InstructorSlider";
import "./instructor-item.css";
import "./instructor.css";

async function getData() {
  const res = await fetch(`${baseURL}/api/users/instructors`);
  if (!res.ok) {
    return [];
  }
  return res.json();
}

const Instructor = async () => {
  const data = await getData();
  if(data?.length === 0) return null
  return (
    <section className="section-mentor">
      <div className="mentor-content container">
        <div className="section-header-and-button d-flex">
          <h2>
            আমাদের <span className="text-primary">অভিজ্ঞ মেন্টর</span>
          </h2>
        </div>
        <div className="mentor-image-cards">
          <InstructorSlider data={data} />
        </div>
      </div>
    </section>
  );
};

export default Instructor;
