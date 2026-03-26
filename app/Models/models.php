<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class models extends Model
{
    protected $table = "models";
    protected $fillable = [
        'model',

        // barellinging
        'barelling_max',
        'barelling_min',
        'barelling_target',
        "chamfer_barelling_max",
        "chamfer_barelling_min",
        "chamfer_barelling_target",
        // CGH (L)
        'cghl_max',
        'cghl_min',
        'cghl_target',
        'chamfer_type',
        // Lapping
        'lappingt_target',
        'lappingt_max',
        'lappingt_min',

        // Slicing
        'slicing_max',
        'slicing_min',
        'slicing_target',

        // Special Lapping
        'flatness_lapping',
        'height_lapping',
        'parallelism_lapping',
    ];
}
