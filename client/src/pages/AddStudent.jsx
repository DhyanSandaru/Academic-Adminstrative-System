import StudentForm from "../components/StudentForm";
import { useState } from "react";
import Layout from "../components/Layout";

export default function AddStudent() {
    return(
        <Layout title="Add Student">
            <StudentForm />
        </Layout>
    )
}