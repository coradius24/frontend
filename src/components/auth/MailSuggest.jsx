import { WHITELISTED_MAIL_DOMAINS } from '@/constants'
import { mailSuggest } from '@/utils/utils'
import React from 'react'
import { IoMdCheckmarkCircleOutline } from 'react-icons/io'
import './MailSuggest.css'
function MailSuggest({ email, updateFn, hideWhitelist }) {
    const suggestions = mailSuggest(email)
    return (
        <div className='mail-suggest'>
            {!hideWhitelist && <> <h5>গ্রহণযোগ্য মেইল প্রোভাইডার সমূহ: </h5>
                <p> {WHITELISTED_MAIL_DOMAINS?.filter(mail => mail != '@upspotacademy.com').join(', ')} </p></>}

            {!!suggestions?.length && <>
                <h5>আপনি কি বোঝাতে চাচ্ছেন:</h5>
                <ul>

                    {suggestions?.map(emailAddress => <li className='suggest-item' key={emailAddress}>
                        <span>{emailAddress}</span>
                        <span className='icon' onClick={() => {
                            console.log("emailAddress", emailAddress, updateFn)
                            updateFn(emailAddress)
                        }} ><IoMdCheckmarkCircleOutline />
                        </span>

                    </li>)}
                </ul>

            </>}

        </div>
    )
}

export default MailSuggest