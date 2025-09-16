import Layout from "../components/Layout";
import CalculateSalary from "../components/CalculateSalary.jsx";

export default function Dashboard() {
    return (
        <Layout title="Dashboard">
            <CalculateSalary />
            {/* <Student/> */}
        </Layout>
        // <main className="bg-gray-200 h-screen w-screen flex justify-center items-center" >
        //     <Form />
        // </main>
    )
}