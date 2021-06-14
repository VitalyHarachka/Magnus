<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Person extends Model
{
    protected $table = 'people';
    protected $guarded = [];

    protected $dates = [];

    public $timestamps = false;

    public function type()
    {
        return $this->belongsTo(PersonType::class);
    }

    public function reports()
    {
        return $this->morphMany(PositionReport::class, 'reportable');
    }
}
