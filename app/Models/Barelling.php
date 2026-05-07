<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Barelling extends Model
{
    protected $table = "barellings";

    protected $fillable = [
        'datalist_id',
        'datalist_lot_number',
        'batch_number',
        'shift',
        'operator_name',
        'checker',
        'staff_engineer',
        'total_batch_number',
        'total_qty_lot',
        'total_qty_lot',
        'media_size',
        'media_weight',
        'coolant_level',
        'styrene_powder',
        'gc_powder',
        'magnet_wt_pc_',
        'chamfertype',
        'status',
        'magnet',
        'points',
        'time_setting',
        'total_qty_batch',
        'contracer_serial',
        'chamfer_jig_serial',
        'total_wt_batch',
        'micrometer_serial'
    ];

    protected $casts = [
        'time_setting' => 'array',
        'points' => 'array',
        'magnet' => 'array',
    ];
}
