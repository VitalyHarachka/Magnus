<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Building extends Model
{
    protected $guarded = [];

    protected $dates = [];

    public function campus()
    {
        return $this->belongsTo(Campus::class);
    }

    public function cameras()
    {
        return $this->hasMany(Camera::class);
    }
}
