<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use app\Models\ModelDetails;

class UserArea extends Model
{
    protected $table = 'area_user';
    protected $fillable =
    [
        'ip_address',
        'first_name',
        'last_name',
        'user_name',
        'machine_type',
        'area',
        'permission',
        'id_number',
        'page'
    ];
}
