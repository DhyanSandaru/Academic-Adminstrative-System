import Form from "../components/StudentForm"
import Layout from "../components/Layout";
import LecturerForm from "../components/LecturerForm";
import Navbar2 from "../components/Navbar2";
import SearchBar from "../components/Searchbar";
import Student from "../components/Student";
import ProfileLayout from "./profiles/ProfileLayout.jsx";
import ContactDetails from "./profiles/ContactDetails.jsx";
import EducationDetails from "./profiles/EducationDetails.jsx";
import PaymentDetails from "./profiles/PaymentStatus.jsx";
import CalculateSalary from "../components/CalculateSalary.jsx";

export default function Dashboard() {
    return (
        <Layout>
            {/* <CalculateSalary /> */}
            <Student/>
        </Layout>
        // <main className="bg-gray-200 h-screen w-screen flex justify-center items-center" >
        //     <Form />
        // </main>
    )
}