const { default: axios } = require("axios");
const { paymentData } = require("../pages/studentData");

const studentData = async () => {
    try{
        const response = await axios.get("http://localhost:8000/view-students");
        const validatedData = response.data.map((student,index) => ({
            courses: student.courses || [],
            payment_status: student.payment_status || ''
        }))
        console.log("student data fetched");
        return validatedData;
    }
    catch(err){
        console.log("Error fetching student Data" || err.response?.data?.message)
    }
}

const totalStudents = studentData.length;

