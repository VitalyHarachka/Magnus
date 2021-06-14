<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PositionReport extends Model
{
    protected $guarded = [];

    protected $dates = ['timestamp'];

    public $timestamps = false;

    protected $casts = ['successful' => 'boolean', 'camera_id' => 'integer'];

    public function reportable()
    {
        return $this->morphTo();
    }

    public function camera()
    {
        return $this->belongsTo(Camera::class);
    }
}
