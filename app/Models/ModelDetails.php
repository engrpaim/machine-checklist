<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ModelDetails extends Model
{
    use HasFactory;
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
        'chamfer_points',

        'chamfer_barelling_target2',
        'chamfer_barelling_min2',
        'chamfer_barelling_max2',

        'perpendicularity',
        'chamfer_point1_data',
        'chamfer_point2_data',
        'slicing_points',
        'lapping_points',
        'cghl_points',

    ];
}
