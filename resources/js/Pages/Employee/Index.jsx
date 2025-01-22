import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Index({ employees, query }) {
    // สร้าง state สำหรับเก็บข้อมูลต่างๆ
    const [search, setSearch] = useState(query || ''); // สำหรับเก็บคำค้นหา
    const [sortColumn, setSortColumn] = useState('emp_no'); // สำหรับเก็บคอลัมน์ที่จะใช้ในการจัดเรียง
    const [sortOrder, setSortOrder] = useState('asc'); // สำหรับเก็บทิศทางการจัดเรียง (ขึ้นหรือลง)
    const [currentPage, setCurrentPage] = useState(employees.current_page); // สำหรับเก็บหมายเลขหน้าในปัจจุบัน
    const [totalPages, setTotalPages] = useState(employees.last_page); // สำหรับเก็บจำนวนหน้าทั้งหมด
    const [isLoading, setIsLoading] = useState(false); // สำหรับจัดการสถานะการโหลดข้อมูล
    const [searchField, setSearchField] = useState('first_name'); // สำหรับเก็บฟิลด์ที่ใช้ในการค้นหา

    // ฟังก์ชันในการดึงข้อมูลพนักงานจากเซิร์ฟเวอร์โดยใช้พารามิเตอร์
    const fetchEmployees = (params) => {
        setIsLoading(true); // ตั้งสถานะโหลดข้อมูลเป็น true
        router.get('/employee', params, {
            replace: true,
            preserveState: true, // รักษาสถานะเดิมระหว่างการนำทาง
            onFinish: () => setIsLoading(false), // รีเซ็ตสถานะโหลดหลังจากเสร็จสิ้น
        });
    };

    // ฟังก์ชันสำหรับการค้นหาข้อมูลเมื่อส่งฟอร์ม
    const handleSearch = (e) => {
        e.preventDefault(); // ป้องกันการส่งฟอร์มแบบปกติ
        fetchEmployees({ search, sortColumn, sortOrder, page: 1 }); // ดึงข้อมูลพนักงานในหน้าแรกโดยใช้คำค้นหาและการจัดเรียงที่ตั้งไว้
    };

    // ฟังก์ชันสำหรับเปลี่ยนหน้า (pagination)
    const handlePageChange = (page) => {
        setCurrentPage(page); // อัปเดตหมายเลขหน้าปัจจุบัน
        fetchEmployees({ search, sortColumn, sortOrder, page }); // ดึงข้อมูลพนักงานสำหรับหน้าที่เลือก
    };

    // ฟังก์ชันสำหรับจัดเรียงเมื่อคลิกที่คอลัมน์
    const handleSort = (column) => {
        // สลับทิศทางการจัดเรียง (จากขึ้นเป็นลงหรือจากลงเป็นขึ้น)
        const newSortOrder = column === sortColumn && sortOrder === 'asc' ? 'desc' : 'asc';
        setSortColumn(column); // ตั้งค่าคอลัมน์ที่ใช้ในการจัดเรียงใหม่
        setSortOrder(newSortOrder); // ตั้งค่าทิศทางการจัดเรียงใหม่
        fetchEmployees({ search, sortColumn: column, sortOrder: newSortOrder, page: currentPage }); // ดึงข้อมูลพนักงานด้วยการจัดเรียงใหม่
    };

    return (
        <AuthenticatedLayout>
        <div className="container mx-auto p-8 bg-gradient-to-r from-blue-50 via-white to-blue-50 shadow-lg rounded-lg">
            <h1 className="text-4xl font-extrabold text-center mb-8 text-blue-700 tracking-wide">
               Employees List
            </h1>

            {/* ฟอร์มการค้นหา */}
            <form onSubmit={handleSearch} className="flex justify-center mb-8">
                    {/* เลือกฟิลด์สำหรับการค้นหา */}
                    <select 
                        value={searchField} 
                        onChange={(e) => setSearchField(e.target.value)} 
                        className="border border-gray-300 rounded p-2 w-1/4">
                        <option value="first_name">First Name</option>
                        <option value="last_name">Last Name</option>
                    </select>

                {/* ช่องกรอกคำค้นหา */}
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)} // อัปเดตค่าใน state เมื่อกรอกข้อมูล
                    className="border border-gray-300 rounded-l-md p-3 w-1/3 focus:outline-none focus:ring-4 focus:ring-blue-300"
                    placeholder="Search employees..."
                />
                {/* ปุ่มค้นหา */}
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-5 py-3 rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-400"
                >
                    Search
                </button>
            </form>

            {/* แสดงข้อมูลเมื่อยังไม่โหลด หรือแสดงตารางพนักงาน */}
            {isLoading ? (
                <p className="text-center text-blue-500 font-semibold mt-8">Loading...</p>
            ) : employees.data.length > 0 ? (
                <>
                    {/* ตารางแสดงข้อมูลพนักงาน */}
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-200 shadow-xl rounded-lg overflow-hidden">
                            <thead className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-900 font-semibold">
                                <tr>
                                    {/* หัวตารางที่สามารถคลิกเพื่อจัดเรียง */}
                                    {['emp_no', 'first_name', 'last_name', 'gender', 'birthday','photo'].map((col) => (
                                        <th
                                            key={col}
                                            onClick={() => handleSort(col)} // คลิกเพื่อจัดเรียง
                                            className="border border-gray-300 px-4 py-3 text-left cursor-pointer hover:bg-blue-300 transition duration-200"
                                        >
                                            {col.replace('_', ' ').toUpperCase()} {/* แสดงชื่อคอลัมน์ */}
                                            {sortColumn === col && (
                                                <span>{sortOrder === 'asc' ? ' ↑' : ' ↓'}</span> // แสดงทิศทางการจัดเรียง
                                            )}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {/* แสดงข้อมูลพนักงาน */}
                                {employees.data.map((employee, index) => (
                                    <tr
                                        key={employee.emp_no}
                                        className={`${
                                            index % 2 === 0 ? 'bg-blue-50' : 'bg-blue-100'
                                        } hover:bg-blue-200 transition duration-200`}
                                    >
                                        <td className="border border-gray-300 px-4 py-3">{employee.emp_no}</td>
                                        <td className="border border-gray-300 px-4 py-3">{employee.first_name}</td>
                                        <td className="border border-gray-300 px-4 py-3">{employee.last_name}</td>
                                        <td className="border border-gray-300 px-4 py-3">
                                            {employee.gender === 'M' ? 'M' : 'F'} {/* แสดงเพศ */}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-3">
                                            {employee.birth_date} {/* แสดงวันเกิด */}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-3">
                                            {employee.photo ? (
                                                <img 
                                                    src={`/storage/${employee.photo}`} 
                                                    alt="Employee" 
                                                    className="w-16 h-16 object-cover rounded-full"
                                                />
                                            ) : (
                                                'No Image' // แสดงข้อความเมื่อไม่มีภาพ
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* ตัวเลือกสำหรับการเปลี่ยนหน้า (pagination) */}
                    <div className="flex justify-center items-center mt-6 space-x-4">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1} // ปิดปุ่ม "ก่อนหน้า" ถ้าเป็นหน้าที่ 1
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>

                        <span className="text-lg font-semibold text-blue-700">
                            {currentPage} / {totalPages} {/* แสดงหมายเลขหน้าและจำนวนหน้าทั้งหมด */}
                        </span>

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages} // ปิดปุ่ม "ถัดไป" ถ้าเป็นหน้าสุดท้าย
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                </>
            ) : (
                <p className="text-center text-red-500 font-semibold mt-8">No data found</p> // แสดงข้อความเมื่อไม่มีข้อมูล
            )}
        </div>
        </AuthenticatedLayout>
    );
}
