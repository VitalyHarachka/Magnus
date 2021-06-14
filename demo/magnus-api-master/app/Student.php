<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    protected $guarded = [];
    protected $primaryKey = 'identifier';
    protected $casts = ['identifier' => 'string'];
    protected $keyType = 'string';
    protected $appends = ['location'];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function reports()
    {
        return $this->morphMany(PositionReport::class, 'reportable');
    }

    public function setIdentifierAttribute($value)
    {
        $this->attributes['identifier'] = (string) $value;
    }

    public function getIdentifierAttribute($value)
    {
        return (string) $this->attributes['identifier'];
    }

    public function getLocationAttribute()
    {
        if ($this->reports->isEmpty()) {
            return [];
        }

        return $this->reports->last()->load('camera', 'camera.building', 'camera.building.campus');
    }
}
