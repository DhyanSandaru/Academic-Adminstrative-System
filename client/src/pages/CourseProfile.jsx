import Layout from "../components/Layout";
import ProfileCourse from "../components/CourseProfile";
import { useParams } from "react-router-dom";

export default function CourseProfile(){
    const {id} = useParams();
    return(
        <Layout>
            <ProfileCourse courseId={id}/>
        </Layout>
    )
}