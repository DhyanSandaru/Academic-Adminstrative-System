import Form from "../components/Form"
import Layout from "../components/Layout";
import LecturerForm from "../components/LecturerForm";
import Navbar2 from "../components/Navbar2";
import SearchBar from "../components/Searchbar";
import Student from "../components/Student";
export default function Dashboard() {
    return (
        <Layout>
            <SearchBar />
            <Student />
        </Layout>
        // <main className="bg-gray-200 h-screen w-screen flex justify-center items-center" >
        //     <Form />
        // </main>
    )
}