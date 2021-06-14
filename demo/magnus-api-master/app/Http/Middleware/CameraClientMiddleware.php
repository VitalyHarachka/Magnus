<?php

namespace App\Http\Middleware;

use App\Repositories\CameraRepository;
use Closure;
use Illuminate\Http\Request;

class CameraClientMiddleware
{
    protected $camera;

    public function __construct(CameraRepository $camera)
    {
        $this->camera = $camera;
    }

    public function handle(Request $request, Closure $next)
    {
        if (!$this->camera->validCamera($request->header('Token'), $request->header('Address'))) {
            return abort(403);
        }

        return $next($request);
    }
}
