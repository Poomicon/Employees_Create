import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
export default function Create({ departments }) {
    const { data, setData, post, processing, errors } = useForm({
        birth_date: '',
        first_name: '',
        last_name: '',
        gender: '',
        hire_date: '',
        department: '',
        photo:''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('first_name', data.first_name);
        formData.append('last_name', data.last_name);
        formData.append('gender', data.gender);
        formData.append('hire_date', data.hire_date);
        formData.append('birth_date', data.birth_date);
        formData.append('department', data.department);
        
        if (data.photo) {
            formData.append('photo', data.photo);
        }
    
        post(route('employee.store'), {
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    };


    return (
       <AuthenticatedLayout>
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
               
                {/* Photo Upload */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Photo:</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setData('photo', e.target.files[0])}
                        className="mt-1 p-2 block w-full border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.photo && <span className="text-red-500 text-sm">{errors.photo}</span>}
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
