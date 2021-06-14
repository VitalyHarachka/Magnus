<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class SecurityAlert extends Model
{
    public $table = 'security_alerts';
    protected $guarded = [];
    public $timestamps = false;

    public function camera()
    {
        return $this->belongsTo(Camera::class);
    }

    public function mark()
    {
        $this->actioned_at = \Carbon\Carbon::now();
        $this->save();
    }
}
