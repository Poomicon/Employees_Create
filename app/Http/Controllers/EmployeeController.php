<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia; 
use Inertia\Response;
class EmployeeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    { 
        $query = $request->input('search'); // หาข้อความได้ทั้งชื่อหรือนามสกุล
        $employees = DB::table("employees") 
            ->where('first_name', 'like', '%' . $query . '%') 
            ->orWhere('last_name','like', '%' . $query . '%')
            ->paginate(10); 
            

        return Inertia::render('Employee/Index', [ 
            'employees' => $employees, 
            'query' => $query,
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
        // รับข้อมูลจากฟอร์ม พร้อมตรวจสอบความถูกต้อง
        $validated = $request->validate([
            "birth_date" => "required|date",
            "first_name" => "required|string|max:255",
            "last_name"  => "required|string|max:255",
            "gender"     => "required|in:M,F", // เพศต้องเป็น M หรือ F
            "hire_date"  => "required|date"
        ]);
    
        // ใช้ Database Transaction เพื่อความปลอดภัย
        DB::transaction(function () use ($validated) { 
            // 1. หาค่า emp_no ล่าสุด 
            $latestEmpNo = DB::table('employees')->max('emp_no') ?? 0; 
            $newEmpNo = $latestEmpNo + 1; // เพิ่มค่า emp_no ทีละ 1
            
            Log::info("New Employee Number: " . $newEmpNo);
    
            // 2. เพิ่มข้อมูลลงในฐานข้อมูลอย่างถูกต้อง
            DB::table("employees")->insert([
                "emp_no"     => $newEmpNo, 
                "first_name" => $validated['first_name'],
                "last_name"  => $validated['last_name'],
                "gender"     => $validated['gender'],
                "birth_date" => $validated['birth_date'],
                "hire_date"  => $validated['hire_date'],
            ]);
        });
    
        // ส่งข้อความตอบกลับเมื่อสำเร็จ
        return response()->json(['message' => 'Employee created successfully']);
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
