<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Campus extends Model
{
    protected $guarded = [];

    protected $dates = [];

    public function buildings()
    {
        return $this->hasMany(Building::class);
    }
}
