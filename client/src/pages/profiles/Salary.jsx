import ProfileLayout from "./ProfileLayout"
import CalculateSalary from "../../components/CalculateSalary"
export default function Salary(){
    return(
        <ProfileLayout>
            <div className="flex justify-center items-center">
                <CalculateSalary />
            </div>
           
        </ProfileLayout>
    )
}