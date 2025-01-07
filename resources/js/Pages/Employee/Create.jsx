import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';//สำหรับหน้าที่ต้องการการยืนยันตัวตน.
export default function Create({ departments }) {
    const { data, setData, post, errors } = useForm({
        first_name: '',
        last_name: '',
        dept_no: '',  // เพิ่ม dept_no เพื่อเก็บค่าแผนก
        gender: '',
        birth_date: '',    // เพิ่มฟิลด์วันเกิด
        hire_date: '',     // เพิ่มฟิลด์วันที่เริ่มงาน
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('employee.store')); // ส่งข้อมูลไปยัง EmployeeController/store
    };

    return (
       <AuthenticatedLayout>
            <form 
                onSubmit={handleSubmit} 
                className="max-w-lg mx-auto bg-white p-8 shadow-lg rounded-lg space-y-6"
            >
                {/* Birth Date */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Birth Date:</label>
                    <input
                        type="date"
                        value={data.birth_date}
                        onChange={(e) => setData('birth_date', e.target.value)}
                        className="mt-1 p-2 block w-full border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.birth_date && <span className="text-red-500 text-sm">{errors.birth_date}</span>}
                </div>

                {/* First Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">First Name:</label>
                    <input
                        type="text"
                        value={data.first_name}
                        onChange={(e) => setData('first_name', e.target.value)}
                        className="mt-1 p-2 block w-full border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.first_name && <span className="text-red-500 text-sm">{errors.first_name}</span>}
                </div>

                {/* Last Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Last Name:</label>
                    <input
                        type="text"
                        value={data.last_name}
                        onChange={(e) => setData('last_name', e.target.value)}
                        className="mt-1 p-2 block w-full border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.last_name && <span className="text-red-500 text-sm">{errors.last_name}</span>}
                </div>

                {/* Gender */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Gender:</label>
                    <select
                        value={data.gender}
                        onChange={(e) => setData('gender', e.target.value)}
                        className="mt-1 p-2 block w-full border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">Select Gender</option>
                        <option value="M">M</option>
                        <option value="F">F</option>
                    </select>
                    {errors.gender && <span className="text-red-500 text-sm">{errors.gender}</span>}
                </div>

                {/* Hire Date */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Hire Date:</label>
                    <input
                        type="date"
                        value={data.hire_date}
                        onChange={(e) => setData('hire_date', e.target.value)}
                        className="mt-1 p-2 block w-full border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.hire_date && <span className="text-red-500 text-sm">{errors.hire_date}</span>}
                </div>

                {/* Department */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Department:</label>
                    <select
                        value={data.dept_no}
                        onChange={(e) => setData('dept_no', e.target.value)}
                        className="mt-1 p-2 block w-full border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">Select Department</option>
                        {departments.map((dept) => (
                            <option key={dept.dept_no} value={dept.dept_no}>
                                {dept.dept_name}
                            </option>
                        ))}
                    </select>
                    {errors.dept_no && <span className="text-red-500 text-sm">{errors.dept_no}</span>}
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
