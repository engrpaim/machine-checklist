<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ModelDetailsFactory extends Factory
{
    public function definition(): array
    {
        return [
            'model' => $this->faker->unique()->bothify('MODEL-###'),

            'barelling_target' => $this->faker->randomFloat(2, 0, 10),
            'barelling_min' => $this->faker->randomFloat(2, 0, 5),
            'barelling_max' => $this->faker->randomFloat(2, 5, 15),

            'chamfer_type' => $this->faker->randomElement([
                'REF. VAL.',
                'R- CHAMFER',
                'C- CHAMFER'
            ]),
        ];
    }
}
