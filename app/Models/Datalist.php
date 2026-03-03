<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Datalist extends Model
{
    protected $table = 'datalists';

    protected $fillable = [
        'lot_number',
        'shift',
        'created_at',
        'updated_at',
        'ip_address',
        'preparing'
    ];
    protected $casts = [
        'preparing' => 'array',
    ];
}
