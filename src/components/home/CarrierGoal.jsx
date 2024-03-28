import { baseURL } from "@/services/api/apiService";
import Link from "next/link";
import CategorySlider from "./CategorySlider";
import "./carrier-goal.css";

async function getData() {
  const res = await fetch(`${baseURL}/api/categories`, {
    next: { revalidate: 300 },
  });
  if (!res.ok) {
    return [];
  }
  return res.json();
}

const CarrierGoal = async () => {
  const data = await getData();
  function flattenSubCategories(arr) {
    let subCategories = [];
    function recursiveFlatten(subArr) {
      for (let item of subArr) {
        if (item.subCategory && Array.isArray(item.subCategory)) {
          subCategories = subCategories.concat(item.subCategory);
          recursiveFlatten(item.subCategory);
        }
      }
    }
    recursiveFlatten(arr);
    return subCategories;
  }

  const subCategoriesArray = flattenSubCategories(data);

  if(subCategoriesArray?.length === 0) return null;

  return (
    <section className="section-carrier-goal" id="category">
      <div className="container">
        <div className="carrier-goal-content">
          <h2>
            <span className="text-primary">জব-মার্কেটে</span> নিজেকে
            চাহিদাসম্পন্ন করতে ক্যারিয়ার গোল সেট করুন
          </h2>
          <p>
            আপনার জন্য প্রয়োজনীয় পছন্দের কোর্সটি এখানে রয়েছে। নিচের অপশন গুলো
            থেকে আপনার পছন্দের কোর্সটি সিলেক্ট করে <br />
            <Link
              href="/free-class-registration"
              className="underline font-weight-600"
            >
              ফ্রি ক্লাসে শেখা শুরু করুন।
            </Link>
          </p>
        </div>

        <div className="carrier-goal-category-slider carrier-goal-content">
          <CategorySlider data={subCategoriesArray} />
        </div>
      </div>
    </section>
  );
};

export default CarrierGoal;
