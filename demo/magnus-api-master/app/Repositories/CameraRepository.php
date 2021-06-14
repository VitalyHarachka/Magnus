<?php

namespace App\Repositories;

use App\Camera;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class CameraRepository
{
    public function __construct(Camera $model)
    {
        $this->model = $model;
    }

    public function validCamera($token, $address)
    {
        try {
            $camera = $this->findByToken($token);
        } catch (ModelNotFoundException $exception) {
            return false;
        }

        if (!$camera->camera_address == $address) {
            return false;
        }

        return true;
    }

    public function findByToken($token)
    {
        return $this->model->where('token', $token)->firstOrFail();
    }
}
