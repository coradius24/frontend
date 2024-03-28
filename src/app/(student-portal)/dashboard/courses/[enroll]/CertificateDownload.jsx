'use client'
import { Button } from '@/components/button/LinkButton'
import LoadingButton from '@/components/button/LoadingButton'
import certificateService from '@/services/certificateService'
import { SweetAlert } from '@/utils/sweet-alert'
import { useLoading } from '@/utils/useCustomHook'
import React, { useEffect, useState } from 'react'
import { HiOutlineDownload } from 'react-icons/hi'
let requestSent = false;
function CertificateDownload({ courseId }) {
    const [data, setData] = useState(null)
    const { isLoading, startLoading, stopLoading } = useLoading()
    const getData = async () => {
        if (isLoading) return;
        startLoading()
        await certificateService.getCertificate(courseId).then(res => setData(res))
        stopLoading()
    }
    useEffect(() => {
        if (!requestSent) {
            requestSent = true;
            getData()
        }
    }, [])

    const handleDownload = async () => {
        let pdfUrl;

        if (data?.file?.url) {
            pdfUrl = data?.file?.url
        } else {
            const {isGenerated, allowCertificate,
                minLessonCompletionRequiredForCertificate,
                minAssignmentCompletionRequiredForCertificate} = data || {};
            const newData = await getData()
            if (!newData?.file?.url) {
                let message = 'সার্টিফিকেট পেতে নিম্নলিখিত শর্তগুলি অবশ্যই পূরণ করতে হবে:';
                
                if (minAssignmentCompletionRequiredForCertificate) {
                    message += ` সর্বনিম্ন ${minAssignmentCompletionRequiredForCertificate} টি এসাইনমেন্ট,`;
                }
            
                if (minLessonCompletionRequiredForCertificate) {
                    message += ` সর্বনিম্ন ${minLessonCompletionRequiredForCertificate} টি লেসন, `;
                }
            
                // Remove the trailing comma
                message = message.replace(/,$/, '');
            
                SweetAlert.fire({
                    title: 'আপনার সার্টিফিকেট ক্রাইটেরিয়া ফুলফিল হয়নি!',
                    text: message,
                    icon: 'info'
                });
            
                return;
            }
            
            pdfUrl = newData?.file?.url

        }

        const link = document.createElement("a");
        link.href = pdfUrl;
        link.download = "certificate.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    if(!data?.allowCertificate) return null;
    return (
        <div className="flex">
            <p>
                আপনি সাকসেসফুললি কোর্সটি কমপ্লিট করেছেন? তাহলে সার্টিফিকেট ডাউনলোড
                এবং শেয়ার করতে পারবেন।
            </p>
            
            {isLoading?  <Button
                disabled
                className="certificate-download"
                text={"লোডিং...."}
                icon={<span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>}
            />: <Button
                onClick={handleDownload}
                className="certificate-download"
                text={"ডাউনলোড"}
                icon={<HiOutlineDownload size={14} />}
            />}
           

        </div>
    )
}

export default CertificateDownload