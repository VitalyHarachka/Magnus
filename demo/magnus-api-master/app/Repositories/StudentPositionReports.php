<?php

namespace App\Repositories;

use App\Camera;
use App\Student;

class StudentPositionReports implements PositionReportsRepositoryInterface
{
    private $model;

    public function __construct(Student $model)
    {
        $this->model = $model;
    }

    public function success(array $data)
    {
        $camera = Camera::findOrFail($data['camera_id']);

        $student = Student::where('identifier', $data['identifier'])->firstOrFail();

        return $student->reports()->create([
            'camera_id'  => $camera->id,
            'successful' => true,
            'timestamp'  => \Carbon\Carbon::now(),
        ]);
    }

    public function unsuccessful(array $data)
    {
        $camera = Camera::findOrFail($data['camera_id']);

        $student = Student::where('identifier', $data['identifier'])->firstOrFail();

        return $student->reports()->create([
            'camera_id'  => $camera->id,
            'successful' => false,
        ]);
    }
}
