import { useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useState } from "react";
import Swal from "sweetalert2";

export default function Create({ departments }) {
    // ใช้ useForm hook สำหรับจัดการฟอร์ม
    const { data, setData, post, processing, errors } = useForm({
        birth_date: '',
        first_name: '',
        last_name: '',
        gender: '',
        hire_date: '',
        department: '',
        photo: ''
    });

    // สถานะสำหรับแสดงข้อความเมื่อมีการบันทึกข้อมูลสำเร็จหรือเกิดข้อผิดพลาด
    const [successMessage, setSuccessMessage] = useState(null);

    const [errorMessage, setErrorMessage] = useState(null);

    // ฟังก์ชันสำหรับการส่งข้อมูลไปยัง Backend
    const handleSubmit = (e) => {
        e.preventDefault(); // ป้องกันการรีเฟรชหน้าเมื่อกด submit


        // ส่งข้อมูลไปยัง route 'employee.store'
        post(route('employee.store'), {
            
            
            headers: {
                'Content-Type': 'multipart/form-data',  // กำหนดประเภทของข้อมูลเป็น multipart/form-data เพื่อรองรับการอัปโหลดไฟล์
            },
            
            onSuccess: () => {
                // แสดงกล่องข้อความแจ้งเตือนเมื่อสร้างพนักงานสำเร็จ
                Swal.fire({
                    icon: "success",  // ไอคอนแสดงความสำเร็จ
                    title: "สำเร็จ!",  // หัวข้อแจ้งเตือน
                    text: "สร้างพนักงานสำเร็จ!",  // ข้อความแจ้งเตือน
                    timer: 3000,  // ตั้งเวลาให้กล่องแจ้งเตือนปิดเองใน 3 วินาที
                    showConfirmButton: false,  // ไม่ต้องแสดงปุ่ม OK
                });
            
                // อัปเดตข้อความสำเร็จ
                setSuccessMessage("Employee created successfully!");
            
                // ล้างข้อความหลังจาก 3 วินาที
                setTimeout(() => {
                    setSuccessMessage('');
                }, 3000);
            },
        
            onError: () => {
                // อัปเดตข้อความข้อผิดพลาด
                setErrorMessage("Error occurred while creating employee. Please try again.");
        
                // ซ่อนข้อความแจ้งเตือนอัตโนมัติหลังจาก 3 วินาที
                setTimeout(() => setErrorMessage(null), 3000);
            }
        });
        
    };

    return (
        <AuthenticatedLayout>
             
             {/* Success/Error Messages */}
                {successMessage && (
                    <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">
                        {successMessage} {/* แสดงข้อความสำเร็จ */}
                    </div>
                )}
                {errorMessage && (
                    <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
                        {errorMessage} {/* แสดงข้อความข้อผิดพลาด */}
                    </div>
                )}

            <form 
                onSubmit={handleSubmit} 
                className="max-w-lg mx-auto bg-white p-8 shadow-lg rounded-lg space-y-6"
            >   
                <h1 className='text-4xl font-extrabold text-center mb-8 text-blue-800 tracking-wide'>Employee</h1>

                {/* First Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">First Name:</label>
                    <input
                        type="text"
                        value={data.first_name}
                        onChange={(e) => setData('first_name', e.target.value)} // อัปเดตค่า first_name
                        className="mt-1 p-2 block w-full border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.first_name && <span className="text-red-500 text-sm">{errors.first_name}</span>} {/* แสดงข้อผิดพลาด */}
                </div>

                {/* Last Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Last Name:</label>
                    <input
                        type="text"
                        value={data.last_name}
                        onChange={(e) => setData('last_name', e.target.value)} // อัปเดตค่า last_name
                        className="mt-1 p-2 block w-full border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.last_name && <span className="text-red-500 text-sm">{errors.last_name}</span>} {/* แสดงข้อผิดพลาด */}
                </div>

                {/* Gender */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Gender:</label>
                    <select
                        value={data.gender}
                        onChange={(e) => setData('gender', e.target.value)} // อัปเดตค่า gender
                        className="mt-1 p-2 block w-full border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">Select Gender</option>
                        <option value="M">M</option>
                        <option value="F">F</option>
                    </select>
                    {errors.gender && <span className="text-red-500 text-sm">{errors.gender}</span>} {/* แสดงข้อผิดพลาด */}
                </div>

                {/* Department */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Department:</label>
                    <select
                        value={data.department}
                        onChange={(e) => setData('department', e.target.value)} // อัปเดตค่า department
                        className="mt-1 p-2 block w-full border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">Select Department</option>
                        {departments.map((dept) => (
                            <option key={dept.dept_no} value={dept.dept_no}>
                                {dept.dept_name}
                            </option>
                        ))}
                    </select>
                    {errors.department && <span className="text-red-500 text-sm">{errors.department}</span>} {/* แสดงข้อผิดพลาด */}
                </div>

                {/* Hire Date */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Hire Date:</label>
                    <input
                        type="date"
                        value={data.hire_date}
                        onChange={(e) => setData('hire_date', e.target.value)} // อัปเดตค่า hire_date
                        className="mt-1 p-2 block w-full border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.hire_date && <span className="text-red-500 text-sm">{errors.hire_date}</span>} {/* แสดงข้อผิดพลาด */}
                </div>

                {/* Birth Date */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Birth Date:</label>
                    <input
                        type="date"
                        value={data.birth_date}
                        onChange={(e) => setData('birth_date', e.target.value)} // อัปเดตค่า birth_date
                        className="mt-1 p-2 block w-full border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.birth_date && <span className="text-red-500 text-sm">{errors.birth_date}</span>} {/* แสดงข้อผิดพลาด */}
                </div>

                {/* Photo Upload */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Photo:</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setData('photo', e.target.files[0])} // อัปเดตค่า photo
                        className="mt-1 p-2 block w-full border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.photo && <span className="text-red-500 text-sm">{errors.photo}</span>} {/* แสดงข้อผิดพลาด */}
                </div>

                {/* Submit Button */}
                <button 
                    type="submit" 
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
                >
                    Create Employee
                </button>
            </form>
        </AuthenticatedLayout>
    );
}
