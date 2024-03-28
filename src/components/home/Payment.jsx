import LinkButton from "../button/LinkButton";
import "./payment.css";
const Payment = () => {
  return (
    <div className="payment-options">
      <div className="rainbow-banner">
        <div className="blur-circle blur-circle-yellow" />
        <div className="blur-circle blur-circle-sky-light" />
        <div className="blur-circle blur-circle-purple" />
        <div className="footer-top-content d-flex container">
          <div className="footer-top-content-left">
            <h2>আপনি যে ব্যাংকগুলি দ্বারা পেমেন্ট করতে পারবেন।</h2>
            <img src="/payment-options.png" alt="payment option" />
          </div>
          <div className="footer-top-content-right">
            <h2>প্রফেশনাল ফ্রি সিপিএ মার্কেটিং</h2>
            <p>
            CPA এর অর্থ হলো Cost Per Action। এফিলিয়েট মার্কেটিং-এর একটি গুরুত্বপূর্ণ পার্ট হচ্ছে সিপিএ মার্কেটিং। সি. পি. এ. মার্কেটিং হল এমন এক ধরনের অ্যাফিলিয়েট মার্কেটিং...
            </p>
            <LinkButton
              text="এখনই শুরু করুন"
              url={"/free-class-registration"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
