<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    use HasFactory;

    // กำหนดฟิลด์ที่สามารถกรอกข้อมูลได้ผ่านการสร้างหรืออัพเดต
    protected $fillable = [
        'emp_no',
        'first_name',
        'last_name',
        'gender',
        'birth_date',
        'hire_date',
        'photo', // เพิ่มฟิลด์ photo
    ];

    // ถ้าคุณไม่ต้องการให้ฟิลด์ใดฟิลด์หนึ่งสามารถกรอกได้
    // สามารถใช้ protected $guarded = ['column_name'] แทนการใช้ $fillable
}
