import { useEffect } from 'react'
import Badge from '../Badge.jsx'
import { Element } from 'react-scroll'

export default function PaymentDetails(){

    return(
        <Element name="payment_details" className='pt-20 pb-20 bg-white w-full rounded-lg shadow-md'>
            <h2 className='text-lg'>Payment Status</h2>
            <div className='flex flex-col justify-center items-center gap-3 h-60'>
                <div className='flex flex-row items-center gap-4'>
                    <p>Chemistry</p>
                    <Badge status="Paid" className='flex-1'/>
                </div>
                <div className='flex flex-row items-center gap-4'>
                    <p>Physics</p>
                    <Badge status="Paid"/>
                </div>
                <div className='flex flex-row items-center gap-4'>
                    <p>Combined Maths</p>
                    <Badge status="Unpaid"/>
                </div>
            </div>
        </Element>
    )
}