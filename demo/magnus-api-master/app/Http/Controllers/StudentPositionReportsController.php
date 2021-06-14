<?php

namespace App\Http\Controllers;

use App\Repositories\StudentPositionReports;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;

class StudentPositionReportsController extends Controller
{
    protected $repository;

    public function __construct(StudentPositionReports $repository)
    {
        $this->repository = $repository;
    }

    public function success(Request $request)
    {
        $this->validate($request, [
            'identifier' => 'required|string',
            'camera_id'  => 'required',
            'notes'      => 'nullable',
        ]);

        try {
            $this->repository->success(['identifier' => $request->identifier, 'camera_id' => $request->camera_id]);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Invalid camera detected'], 422);
        }

        return response()->json(['success' => 'Successful position report filed.'], 201);
    }
}
