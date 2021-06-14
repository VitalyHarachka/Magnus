<?php

namespace App\Repositories;

interface PositionReportsRepositoryInterface
{
    public function success(array $data);

    public function unsuccessful(array $data);
}
