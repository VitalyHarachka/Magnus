<?php

namespace App\Http\Controllers;

use Laravel\Lumen\Routing\Controller as BaseController;

class Controller extends BaseController
{
    protected function errorResponse($message = 'An error has occurred.')
    {
        return response()->json(['error' => $message], 404);
    }
}
