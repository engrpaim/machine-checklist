<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ModelDetails;

class ModelSeeder extends Seeder
{
    public function run(): void
    {
        ModelDetails::factory()->count(1000)->create();
    }
}
