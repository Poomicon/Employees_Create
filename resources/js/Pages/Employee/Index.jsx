import { router } from '@inertiajs/react'; 
import { useState } from 'react'; 
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';//สำหรับหน้าที่ต้องการการยืนยันตัวตน.
// query = ค่าของการค้นหาที่ส่งกลับมาจาก controller
// employees = ข้อมูลพนักงานที่ส่งกลับมาจาก controller
export default function Index({ employees, query }) { 
    const [search, setSearch] = useState(query || ''); 
    const [searchField, setSearchField] = useState('first_name');

    const handleSearch = (e) => { 
        e.preventDefault(); 
         // search คือค่าที่เราพิมพ์ในช่อง input
        router.get('/employee', { search, searchField });
    };

    return ( 
        <AuthenticatedLayout>
            <div className="p-8 bg-gray-100 min-h-screen"> 
                <h1 className="text-2xl font-bold text-center mb-4">Employee List</h1> 
                <form onSubmit={handleSearch} className="mb-4 flex gap-2"> 
                <select 
                        value={searchField} 
                        onChange={(e) => setSearchField(e.target.value)} 
                        className="border border-gray-300 rounded p-2 w-1/4">
                        <option value="first_name">First Name</option>
                        <option value="last_name">Last Name</option>
                    </select>
                    <input 
                        type="text" 
                        value={search} 
                        onChange={(e) => setSearch(e.target.value)}
                        className="border border-gray-300 rounded p-2 w-full"
                        placeholder="Search employees..."
                    /> 
                    <button 
                        type="submit" 
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Search 
                    </button> 
                </form>
                <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden"> 
                    <thead className="bg-blue-500 text-white"> 
                        <tr> 
                            <th className="py-2 px-4">ID</th> 
                            <th className="py-2 px-4">First Name</th> 
                            <th className="py-2 px-4">Last Name</th> 
                            <th className='py-2 px-4'>Gender</th>
                            <th className="py-2 px-4">Age</th> 
                        </tr> 
                    </thead> 
                    <tbody> 
                        {employees.data.length > 0 ? (
                            employees.data.map((employee, index) => (
                                <tr key={index} className="even:bg-gray-100 odd:bg-white text-center"> 
                                    <td className="py-2 px-4 border">{employee.emp_no}</td>
                                    <td className="py-2 px-4 border">{employee.first_name}</td>
                                    <td className="py-2 px-4 border">{employee.last_name}</td>
                                    <td className="py-2 px-4 border">{employee.gender}</td>
                                    <td className="py-2 px-4 border">{employee.birth_date}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center py-4 text-red-500">No employees found for "{search}"</td>
                            </tr>
                        )}
                    </tbody> 
                </table> 

                <div className="flex justify-between mt-4"> 
                    <button 
                        className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${!employees.prev_page_url ? 'opacity-50 cursor-not-allowed' : ''}`} 
                        disabled={!employees.prev_page_url} 
                        onClick={()=> window.location.assign(employees.prev_page_url)}> 
                        Previous
                    </button>

                    <span className="text-lg font-bold  text-center">Page {employees.current_page} of {employees.last_page}</span>
                    
                    <button 
                        className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${!employees.next_page_url ? 'opacity-50 cursor-not-allowed' : ''}`} 
                        disabled={!employees.next_page_url} 
                        onClick={()=> window.location.assign(employees.next_page_url)}> 
                        Next
                    </button>
                </div>
            </div>
        </AuthenticatedLayout>
    ); 
}
