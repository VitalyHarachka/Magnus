<?php

namespace App\Http\Controllers;

use App\Student;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;

class StudentsController extends Controller
{
    public function index()
    {
        $students = Student::with(['course', 'reports'])->get();

        return response()->json(['data' => ['students' => $students]]);
    }

    public function show($id)
    {
        try {
            $student = Student::findOrFail($id)->load('course');
        } catch (ModelNotFoundException $exception) {
            return response()->json(['error' => 'Student not found.']);
        }

        return response()->json(['data' => ['student' => $student]]);
    }

    public function store(Request $request)
    {
        $data = $this->validate($request, [
            'identifier' => 'required|string|unique:students,identifier',
            'name_first' => 'required|string',
            'name_last'  => 'required|string',
            'course_id'  => 'required',
            'dob'        => 'required',
            'gender'     => 'required',
            'start_year' => 'required',
        ]);

        $student = Student::create($data);

        return response()->json(['success' => 'Student Created'], 201)->header('Location', route('students.show', ['id' => $student->id]));
    }
}
