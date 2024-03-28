'use client'
import { Button } from "@/components/button/LinkButton";
import paymentService from "@/services/paymentService";

import "./page.css";
import { useLoading } from "@/utils/useCustomHook";
import LoadingButton from "@/components/button/LoadingButton";
const  PayDueActionButton = ({courseId, due}) => {
    const { isLoading, startLoading, stopLoading } = useLoading();
  
    const handlePayment = async () => {
      startLoading();
      const res = await paymentService.createPayment({
        courseId: courseId,
        amount: due,
      });
      window.location.assign(res.checkout_url);
    };
  
    return <> {isLoading? <LoadingButton size="10" /> :  <Button onClick={handlePayment} text={"পরিশোধ করুন"} size={10} /> }</>
  
    
  }

  export default PayDueActionButton;