<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class cghModel extends Model
{
    protected $table = "cgh_models";

    protected $fillable = [
        'datalist_id',
        'datalist_lot_number',
        'batch_number',
        'shift',
        'operator_name',
        'checker',
        'staff_engineer',
        'batch_number',
        'machine_number',
        'model',
        'upper_conveyor_speed',
        'lower_conveyor_speed',
        'carrier_speed',
        'autocy_forward_speed',
        'autocy_moving_distance',
        'micrometer_serial_number',
        'mass_pro',
        'technician_gl',
        'points',
        'perpendicularity'

    ];

    protected $casts = [
        'mass_pro' => 'array',
        'points' => 'array',
        'perpendicularity' => 'array',
    ];
}
