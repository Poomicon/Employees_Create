<?php

use App\Http\Controllers\EmployeeController;
use Illuminate\Http\Request;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\UserController;
// นำเข้าคอนโทรลเลอร์ที่ใช้ในเส้นทางต่าง ๆ
use App\Http\Controllers\ChirpController;
use App\Http\Controllers\ProfileController;
// นำเข้าคลาสที่ใช้สำหรับแอปพลิเคชัน
use Illuminate\Foundation\Application;
// นำเข้าคลาสที่ใช้สำหรับกำหนดเส้นทาง
use Illuminate\Support\Facades\Route;

use Inertia\Inertia;


Route::get('/employee', [EmployeeController::class, 'index'])->name('employee.index');
// Route::resource('employee', EmployeeController::class) ->only(['index']);

Route::get('/employee/create', [EmployeeController::class, 'create'])->name('employee.create');
// หน้าฟอร์มสำหรับเพิ่มข้อมูลพนักงาน
Route::post('/employee', [EmployeeController::class, 'store'])->name('employee.store');
//function สำหรับบันทึกข้อมูลพนักงาน


Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
