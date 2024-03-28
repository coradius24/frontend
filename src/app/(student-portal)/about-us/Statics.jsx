import CustomAccordion, { CustomAccordionItem } from "@/components/Accordion";
import "./statics.css";
const Statics = () => {
  const items = [
    {
      id: "item1",
      heading: "আমাদের লক্ষ্য্য",
      content:
        "আইটি কোম্পানির উদ্দেশ্য হলো একটি প্রযুক্তির মাধ্যমে সমাজে এবং ব্যবসায়ে উপকারে আসা। এই কোম্পানির মৌলিক উদ্দেশ্য মূলত দুটি দিকে বিবেচনা করা যেতে পারে: প্রথমত, কোম্পানির উদ্দেশ্য হলো সম্প্রদায়ের এবং ব্যবসায়ের প্রযুক্তি সুযোগ প্রদান করা হয়।",
    },
    {
      id: "item2",
      heading: "আমাদের উদ্দেশ্য",
      content:
        "আইটি কোম্পানির উদ্দেশ্য হলো একটি প্রযুক্তির মাধ্যমে সমাজে এবং ব্যবসায়ে উপকারে আসা। এই কোম্পানির মৌলিক উদ্দেশ্য মূলত দুটি দিকে বিবেচনা করা যেতে পারে: প্রথমত, কোম্পানির উদ্দেশ্য হলো সম্প্রদায়ের এবং ব্যবসায়ের প্রযুক্তি সুযোগ প্রদান করা হয়।",
    },
    {
      id: "item3",
      heading: "আমাদের মান",
      content:
        "আইটি কোম্পানির উদ্দেশ্য হলো একটি প্রযুক্তির মাধ্যমে সমাজে এবং ব্যবসায়ে উপকারে আসা। এই কোম্পানির মৌলিক উদ্দেশ্য মূলত দুটি দিকে বিবেচনা করা যেতে পারে: প্রথমত, কোম্পানির উদ্দেশ্য হলো সম্প্রদায়ের এবং ব্যবসায়ের প্রযুক্তি সুযোগ প্রদান করা হয়।",
    },
  ];
  return (
    <section className="statics">
      <div className="container">
        <div className="content flex">
          <div className="statics-counts flex">
            <div className="count">
              <p>300,00+</p>
              <span>মোট শিক্ষার্থী</span>
            </div>
            <div className="count">
              <p>12,00+</p>
              <span>ফ্রিল্যান্সার এবং জব হোল্ডার</span>
            </div>
            <div className="count">
              <p>12,00+</p>
              <span>দক্ষ জব হোল্ডার</span>
            </div>
            <div className="count">
              <p>12,00+</p>
              <span>দক্ষ জব হোল্ডার</span>
            </div>
          </div>
          <div className="statics-text">
            <h2>
              গ্লোবাল আইটি বিশেষজ্ঞ তৈরিরতে ভূমিকা রাখছে{" "}
              <span className="text-primary"> আপস্পট একাডেমি </span>{" "}

            </h2>
            <p>
              আপস্পট একাডেমি একটি পূর্ণরূপে প্রযুক্তির জগতে প্রবীণ হওয়ার জন্য
              একটি প্রস্তুতি প্রদান করছে অত্যন্ত গুরুত্বপূর্ণ প্ল্যাটফর্ম। এখানে
              প্রশিক্ষণ প্রাপ্ত ছাত্রদের প্রযুক্তির প্রস্তুতির জন্য পর্যাপ্ত
              ধারাবাহিক ধারণা অর্জন করার জন্য সকল প্রকার সুযোগ প্রদান করা হয়।
            </p>
            <div className="statics-accordion-area">
              <CustomAccordion preExpandedId={items[0].id}>
                {items.map((item) => (
                  <CustomAccordionItem key={item.id} item={item} />
                ))}
              </CustomAccordion>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Statics;
