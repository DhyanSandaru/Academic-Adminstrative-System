import { useState, useRef, useEffect, useContext } from "react";
import axios from "axios";
import AdminLayout from "../components/AdminProfiles/AdminLayout.jsx";
import AdminForm from "../components/AdminForm.jsx";
import PersonalDetails from "../components/AdminProfiles/PersonalDetails.jsx";
import ContactDetails from "../components/AdminProfiles/ContactDetails.jsx";
import AccountDetails from "../components/AdminProfiles/AccountDetails.jsx";
import { AuthContext } from "../context/AuthContext"; // Adjust path as needed

export default function AdminProfile() {
  const { user } = useContext(AuthContext);
  const [adminData, setAdminData] = useState({
    name: '',
    email: '',
    nic: '',
    gender: '',
    mobile: '',
    address: '',
    accountStatus: 'Active',
    lastLogin: 'Never',
    profilePhoto: ''
  });
  const [previewUrl, setPreviewUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [activeSection, setActiveSection] = useState("personal");
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    nic: '',
    gender: '',
    mobile: '',
    address: '',
    accountStatus: 'Active',
    lastLogin: 'Never',
    profilePhoto: ''
  }); 

  // Section Refs
  const personalRef = useRef(null);
  const contactRef = useRef(null);
  const accountRef = useRef(null);

  // Fetch admin data on component mount
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        if (!user?.id) {
          console.error('No user ID found');
          setLoading(false);
          return;
        }

        const response = await axios.get(`http://localhost:8000/api/admins/view-admins/id/${user.id}`);
        const admin = response.data.admin;
        
        setAdminData({
          id: admin.id || '',
          name: admin.name || '',
          email: admin.email || '',
          nic: admin.nic || '',
          gender: admin.gender || '',
          mobile: admin.mobile || '',
          address: admin.address || '',
          accountStatus: admin.accountStatus || 'Active',
          lastLogin: admin.lastLogin || 'Never',
          profilePhoto: admin.profilePhoto || ''
        });

        setFormData({
          id: admin.id || '',
          name: admin.name || '',
          email: admin.email || '',
          nic: admin.nic || '',
          gender: admin.gender || '',
          mobile: admin.mobile || '',
          address: admin.address || '',
          accountStatus: admin.accountStatus || 'Active',
          lastLogin: admin.lastLogin || 'Never',
          profilePhoto: admin.profilePhoto || ''
        });

        if (admin.profilePhoto) {
          setPreviewUrl(`http://localhost:8000/api/admins/${admin.profilePhoto}`);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching admin data:', error);
        alert('Failed to load admin data');
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [user]);

  const scrollToSection = (ref, section) => {
    setActiveSection(section);
    ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
      // Store the file for upload
      setFormData(prev => ({
        ...prev,
        photoFile: file
      }));

    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          form.append(key, value);
        }
      });

      const response = await axios.put(
        `http://localhost:8000/api/admins/view-admins/${user.id}`,
        form,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      // SUCCESS → update adminData
      setAdminData(response.data.admin);
      setFormData(response.data.admin);

      alert("Saved successfully");

    } catch (err) {
      console.error(err);
      alert("Update failed, reverting changes...");

      // FAIL → revert formData
      setFormData(adminData);
    } finally {
      setSaving(false);
    }
  };


  if (loading) {
    return (
      <AdminLayout
        showForm={false}
        setShowForm={setShowForm}
        activeSection={activeSection}
        scrollToSection={scrollToSection}
        personalRef={personalRef}
        contactRef={contactRef}
        accountRef={accountRef}
      >
        <div className="flex justify-center items-center h-64">
          <div className="text-xl text-gray-600">Loading...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      showForm={showForm}
      setShowForm={setShowForm}
      activeSection={activeSection}
      scrollToSection={scrollToSection}
      personalRef={personalRef}
      contactRef={contactRef}
      accountRef={accountRef}
    >
      {showForm ? (
        <AdminForm setShowForm={setShowForm} />
      ) : (
        <div className="flex flex-col space-y-8 px-4 sm:px-6 md:px-0">
          {/* Personal Details Section */}
          <PersonalDetails
            ref={personalRef}
            adminData={formData}
            handleChange={handleChange}
            handlePhotoChange={handlePhotoChange}
            handleSave={handleSave}
            previewUrl={previewUrl}
            saving={saving}
          />

          {/* Contact Details Section */}
          <ContactDetails
            ref={contactRef}
            adminData={formData}
            handleChange={handleChange}
            handleSave={handleSave}
            saving={saving}
          />

          {/* Account Details Section */}
          <AccountDetails
            ref={accountRef}
            adminData={formData}
            handleChange={handleChange}
          />
        </div>
      )}
    </AdminLayout>
  );
}