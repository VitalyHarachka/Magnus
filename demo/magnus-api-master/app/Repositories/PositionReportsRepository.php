<?php

namespace App\Repositories;

use App\Camera;
use App\PositionReport;
use Carbon\Carbon;

class PositionReportsRepository implements PositionReportsRepositoryInterface
{
    /** @var PositionReport */
    private $model;

    public function __construct(PositionReport $model)
    {
        $this->model = $model;
    }

    public function success(array $data)
    {
        $this->cameraIsValid($data['camera_id']);

        return $this->model->create([
            'camera_id' => $data['camera_id'],
            'person_id' => $data['person_id'],
            'success'   => true,
            'timestamp' => Carbon::now(),
        ]);
    }

    public function unsuccessful(array $data)
    {
        $this->cameraIsValid($data['camera_id']);

        return $this->model->create([
            'camera_id' => $data['camera_id'],
            'person_id' => $data['person_id'],
            'success'   => false,
            'timestamp' => Carbon::now(),
        ]);
    }

    private function cameraIsValid($id)
    {
        return Camera::findOrFail($id);
    }
}
