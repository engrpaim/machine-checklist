<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Data extends Model
{
    protected $table = 'data';
    protected $fillable = [
        'model',
        'process',
        'lot',
        'total_lot',
        'qty_lot',
        'wt_lot',
        'media_size',
        'media_weight',
        'coolant',
        'styrenre',
        'gc_powder',
        'magnet_wt',
        'chamfer_type',
        'date',
        'shift',
        'operator',
        'checker',
        'staff_eng',
        'remarks',
        'barrelling',
        'pt_data',
        'timer'
    ];

    protected $casts = [
        'barrelling' => 'array',
        'pt_data' => 'array',
        'timer' => 'array',
    ];
}
