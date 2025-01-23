<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia; 
use Illuminate\Support\Facades\Redirect;

class EmployeeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    { 
        // รับค่าการค้นหาที่ผู้ใช้ป้อน (ค้นหาทั้งชื่อและนามสกุล)
        $query = $request->input('search'); 

        // รับคอลัมน์ที่ต้องการเรียงลำดับ ถ้าไม่มีค่าให้ใช้ 'emp_no' เป็นค่าเริ่มต้น
        $sortColumn = $request->input('sortColumn', 'emp_no');

        // รับลำดับการเรียง (asc/desc) ถ้าไม่มีค่าให้ใช้ 'desc' เป็นค่าเริ่มต้น
        $sortOrder = $request->input('sortOrder', 'desc'); 

        // ตรวจสอบว่าหากเรียงลำดับตาม emp_no ให้สลับลำดับการเรียงโดยอัตโนมัติ
        if ($sortColumn == 'emp_no') {
            $sortOrder = $sortOrder === 'desc' ? 'asc' : 'desc'; 
        }

        // ค้นหาข้อมูลพนักงานโดยพิจารณาจากคำค้นหาและเรียงลำดับข้อมูล
        $employees = Employee::when($query, function ($queryBuilder, $query) {
                $queryBuilder
                    ->where('first_name', 'like', '%' . $query . '%') // ค้นหาชื่อตรงกับคำค้นหา
                    ->orWhere('last_name', 'like', '%' . $query . '%'); // ค้นหานามสกุลตรงกับคำค้นหา
            })
            ->orderBy($sortColumn, $sortOrder) // เรียงลำดับข้อมูลตามคอลัมน์ที่กำหนด
            ->paginate(10);  // แสดงผลหน้าละ 10 รายการ

        // ส่งข้อมูลไปยังหน้าแสดงผลโดยใช้ Inertia.js พร้อมกับตัวแปรที่ใช้ในการแสดงผล
        return Inertia::render('Employee/Index', [
            'employees' => $employees,  // รายชื่อพนักงานที่ได้จากฐานข้อมูล
            'query' => $query,  // คำค้นหาที่ผู้ใช้ป้อนเข้ามา
            'sortColumn' => $sortColumn,  // คอลัมน์ที่ใช้เรียงลำดับ
            'sortOrder' => $sortOrder,  // ลำดับการเรียง (asc/desc)
        ]);



        
       // $data = json_decode(json_encode($employees), true); // ใช้ json ในการแสดงผล array 
      // Log::info($employees); 

        // return response($data); 
        // return Inertia::render('Employee/Index', [ 
        //     'employees' => $employees, 
        // ]);

    }



    /**
     * Show the form for creating a new resource.
     */
    public function create() 
    { 
        // ดึงรายชื่อแผนกจากฐานข้อมูล เพื่อไปแสดงให้เลือกรายการในแบบฟอร์ม 
        $departments = DB::table('departments')->select('dept_no', 'dept_name')->get(); 
        //  Inertia ส่งข้อมูล departments ไปยังหน้า create ในรูปเเบบ json
        return inertia('Employee/Create', ['departments' => $departments]); 
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // ตรวจสอบความถูกต้องของข้อมูลที่ส่งมา
        $validated = $request->validate([
            "birth_date" => "required|date",  // ต้องระบุวันเกิด และต้องอยู่ในรูปแบบวันที่ที่ถูกต้อง
            "first_name" => "required|string|max:255",  // ต้องระบุชื่อ และต้องเป็นตัวอักษรไม่เกิน 255 ตัว
            "last_name"  => "required|string|max:255",  // ต้องระบุนามสกุล และต้องเป็นตัวอักษรไม่เกิน 255 ตัว
            "gender"     => "required|in:M,F",  // ต้องระบุเพศ และต้องเป็น 'M' หรือ 'F' เท่านั้น
            "hire_date"  => "required|date",  // ต้องระบุวันที่จ้าง และต้องเป็นรูปแบบวันที่ที่ถูกต้อง
            "photo"      => "nullable|image|mimes:jpeg,png,jpg,gif|max:2048"  // อัปโหลดไฟล์รูปภาพ (ถ้ามี), รองรับเฉพาะไฟล์ที่กำหนด และขนาดไม่เกิน 2MB
        ]);

        try {
            // ใช้ Transaction เพื่อให้มั่นใจว่าการดำเนินการทั้งหมดจะสำเร็จหรือล้มเหลวพร้อมกัน
            DB::transaction(function () use ($validated, $request) {
                // ดึงค่า emp_no ล่าสุดจากฐานข้อมูล ถ้าไม่มีข้อมูลให้เริ่มที่ 0
                $latestEmpNo = DB::table('employees')->max('emp_no') ?? 0;
                $newEmpNo = $latestEmpNo + 1;  // กำหนด emp_no ถัดไปโดยเพิ่มขึ้นทีละ 1

                // ตรวจสอบว่ามีการอัปโหลดไฟล์รูปภาพหรือไม่
                if ($request->hasFile('photo')) {
                    // จัดเก็บรูปภาพในโฟลเดอร์ 'public/employees' และคืนค่า path ของรูปภาพที่จัดเก็บ
                    $photoPath = $request->file('photo')->store('employees', 'public');
                    $validated['photo'] = $photoPath;  // เพิ่ม path รูปภาพลงในข้อมูลที่ผ่านการตรวจสอบ
                }

                // บันทึกข้อมูลพนักงานใหม่ลงในตาราง employees
                DB::table("employees")->insert([
                    "emp_no"     => $newEmpNo,  // หมายเลขพนักงานใหม่
                    "first_name" => $validated['first_name'],  // ชื่อพนักงาน
                    "last_name"  => $validated['last_name'],  // นามสกุลพนักงาน
                    "gender"     => $validated['gender'],  // เพศของพนักงาน
                    "birth_date" => $validated['birth_date'],  // วันเกิดของพนักงาน
                    "hire_date"  => $validated['hire_date'],  // วันที่เริ่มงานของพนักงาน
                    "photo"      => $validated['photo'] ?? null  // รูปพนักงาน (ถ้ามี)
                ]);
            });

            // เมื่อสำเร็จให้เปลี่ยนเส้นทางไปยังหน้าแสดงรายชื่อพนักงานพร้อมแสดงข้อความสำเร็จ
            return Redirect::route('employee.index')->with('success', 'Employee created successfully!');

        } catch (\Exception $e) {
            // บันทึกข้อผิดพลาดลงใน log เพื่อใช้ในการตรวจสอบภายหลัง
            Log::error('Error creating employee: ' . $e->getMessage());

            // ส่งกลับไปยังหน้าฟอร์มพร้อมแสดงข้อผิดพลาดและคืนค่าข้อมูลที่ผู้ใช้กรอกไว้
            return Redirect::back()->withErrors(['error' => 'An error occurred while creating employee. Please try again.'])
                                ->withInput();
        }
    }



    /**
     * Display the specified resource.
     */
    public function show(Employee $employee)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Employee $employee)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Employee $employee)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Employee $employee)
    {
        //
    }
}
