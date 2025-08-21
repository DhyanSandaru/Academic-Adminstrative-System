import ProfileLayout from './ProfileLayout.jsx'
import { useEffect } from 'react'
import Badge from '../../components/Badge.jsx'

export default function PaymentDetails(){

    return(
        <ProfileLayout>
            <div className='flex flex-col justify-center items-center gap-3 h-60'>
                <div className='flex flex-row items-center gap-4'>
                    <p>Chemistry</p>
                    <Badge status="Paid"/>
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
        </ProfileLayout>
    )
}