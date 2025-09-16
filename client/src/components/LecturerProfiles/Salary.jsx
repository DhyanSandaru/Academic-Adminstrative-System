import ProfileLayout from "../profiles/ProfileLayout"
import CalculateSalary from "../CalculateSalary"
export default function Salary(){
    return(
        <ProfileLayout>
            <div className="flex justify-center items-center">
                <CalculateSalary />
            </div>
           
        </ProfileLayout>
    )
}