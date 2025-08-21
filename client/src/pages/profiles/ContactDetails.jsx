import { useEffect,useState } from 'react';
import ProfileLayout from './ProfileLayout.jsx'

export default function ContactDetails(){


    const[formData,setFormData] = useState({
        phone: '',
        email: '',
        address: ''
    })

    const [originalData,setOriginalData] = useState({
        phone: '',
        email: '',
        address: ''
    })

    const fetchData = async() => {
        try{
            const response = await fetch('http://localhost:8000/view-students/student/get-contact-details');
            if(!response.ok){
                throw new Error("Error fetching data");
            }
            const data = await response.json();
            setFormData(data);
            setOriginalData(data);

        }catch(err){
            console.log(err)
            alert("Failed to fetch data")
        }
    }

    useEffect(fetchData,[]);

    const handleChange = (e) => {
        const {name,value} = e.target;
        setFormData(prev => ({...prev,[name]:value}))
    }

    const handleUpdate = async() => {
        try{
        const response = await fetch("http://localhost:8000/view-students/student/contact-details",{
            method: "POST",
            headers:{
                'Content-type':'application/json'
            },
            body: JSON.stringify(formData)
            }
        );

        if(response.ok){
            alert("Contact details updated successfully")
            await fetchData();
        }
        else{
            alert("Failed to update")
            setFormData(originalData)
        }

        } catch(err) {
            console.error(err);
            setFormData(originalData)
        }
    }

    return(
        <ProfileLayout>
            <div className='m-3 flex flex-col gap-6'>
                <div className='flex flex-col justify-start m-3'>
                    <p className='text-left ml-2'>Phone Number</p>
                     <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="bg-blue-200 rounded-lg w-[80%] m-1 p-2 outline-none"
                    />
                </div>
                <div className='flex flex-col justify-start m-3'>
                    <p className='text-left ml-2'>Email</p>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="bg-blue-200 rounded-lg w-[80%] m-1 p-2 outline-none"
                    />
                </div>
                <div className='flex flex-col justify-start m-3'>
                    <p className='text-left ml-2'>Residential Address</p>
                   <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="bg-blue-200 rounded-lg w-[80%] m-1 p-2 outline-none"
                    />
                </div>

                <button onClick={handleUpdate}className='bg-green-500 mt-5 mb-10 ml-4 w-30  duration-300 ease-out transform hover:scale-105 hover:bg-green-600'>Update</button>
            </div>


        </ProfileLayout>
    )
}