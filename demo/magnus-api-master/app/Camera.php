<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Camera extends Model
{
    protected $guarded = [];

    protected $dates = [];

    protected $casts = ['active' => 'bool', 'id' => 'integer'];

    protected $hidden = ['camera_token'];

    public function building()
    {
        return $this->belongsTo(Building::class);
    }

    public function alerts()
    {
        return $this->hasMany(SecurityAlert::class);
    }

    public function reports()
    {
        return $this->hasMany(PositionReport::class);
    }

    public function findByToken($token)
    {
        return $this->where('token', $token)->firstOrFail();
    }
}
