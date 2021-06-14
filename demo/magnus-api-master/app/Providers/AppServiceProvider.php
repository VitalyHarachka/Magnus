<?php

namespace App\Providers;

use App\Repositories\PositionReportsRepository;
use App\Repositories\PositionReportsRepositoryInterface;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        if ($this->app->environment() == 'local') {
            $this->app->register('Wn\Generators\CommandsServiceProvider');
        }

        $this->app->bind(PositionReportsRepositoryInterface::class, PositionReportsRepository::class);
        $this->app->bind(PositionReportsRepositoryInterface::class, StudentPositionReports::class);
    }
}
